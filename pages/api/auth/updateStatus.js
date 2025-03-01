import prisma from '/lib/prisma'; // Ensure the correct path to your Prisma client

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { caseId, patientName, age, gender, diagnosis, treatment, status, prescribedMedicine, dosage } = req.body;

    // Log the incoming data for debugging
    console.log("Received data:", { caseId, patientName, age, gender, diagnosis, treatment, status, prescribedMedicine, dosage });

    // Validate request payload
    if (!caseId || !status) {
      return res.status(400).json({ error: 'Invalid caseId or status' });
    }

    // Check if caseId exists in the database
    const existingCase = await prisma.caseStatus.findUnique({
      where: { id: caseId },
    });

    if (!existingCase) {
      // If case doesn't exist, create a new one
      const newCase = await prisma.caseStatus.create({
        data: {
          id: caseId,
          patientName,
          age,
          gender,
          diagnosis,
          treatment,
          status,
          prescribedMedicine,
          dosage,
        },
      });

      console.log("New case created:", newCase);
      return res.status(200).json({ message: 'Case created successfully', newCase });
    } else {
      // If case exists, update the case
      const updatedCase = await prisma.caseStatus.update({
        where: { id: caseId },
        data: {
          status,
          prescribedMedicine,
          dosage,
        },
      });

      console.log("Updated case:", updatedCase);
      return res.status(200).json({ message: 'Case status updated successfully', updatedCase });
    }
  } catch (error) {
    console.error('Error updating case status:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }

    res.status(500).json({ error: 'Failed to update case status' });
  }
}
