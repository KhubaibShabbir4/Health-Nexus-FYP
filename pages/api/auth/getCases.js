import prisma from '/lib/prisma'; // Import Prisma client

export default async function handler(req, res) {
  try {
    // Fetch all cases from the CaseStatus table
    const cases = await prisma.caseStatus.findMany();

    if (!cases || cases.length === 0) {
      return res.status(404).json({ error: 'No cases found' });
    }

    return res.status(200).json(cases); // Return fetched cases

  } catch (error) {
    console.error('Error fetching cases:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
