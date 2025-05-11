import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { pharmacistId } = req.query;

    let gigs;

    if (pharmacistId) {
      gigs = await prisma.gigDetails.findMany({
        where: {
          pharmacistId: parseInt(pharmacistId),
        },
        include: {
          prescription: {
            include: {
              patient: true
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      gigs = await prisma.gigDetails.findMany({
        include: {
          prescription: {
            include: {
              patient: true
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Transform the data to include patient name before sending
    const transformedGigs = gigs.map(gig => ({
      ...gig,
      patientName: gig.prescription?.patient?.patient_name || gig.patientName || 'N/A'
    }));

    // Add debug log
    console.log('Fetched gigs with patient info:', JSON.stringify(transformedGigs, null, 2));

    return res.status(200).json({ gigs: transformedGigs });
  } catch (error) {
    console.error('Error fetching gig details with patient info:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
