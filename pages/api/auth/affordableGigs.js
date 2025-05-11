import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const gigs = await prisma.gigDetails.findMany({
        orderBy: {
          price: 'asc'
        }
      });
      return res.status(200).json({ gigs });
    }

    if (req.method === 'PUT') {
      const { gigId, status, rejectionReason } = req.body;
      const updatedGig = await prisma.gigDetails.update({
        where: { id: gigId },
        data: { 
          status: status,
          rejectionReason: rejectionReason || undefined
        }
      });
      return res.status(200).json(updatedGig);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
