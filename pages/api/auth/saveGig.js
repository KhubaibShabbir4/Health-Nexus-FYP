import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { gigAmount, caseId, patientName } = req.body;

    if (!gigAmount || !caseId || !patientName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const newGig = await prisma.gigDetails.create({
        data: {
          gigAmount: parseInt(gigAmount),
          caseId: parseInt(caseId),
          patientName,
        },
      });
      res.status(201).json(newGig);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save gig details" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
