import prisma from '/lib/prisma';

export const config = {
    runtime: 'nodejs',
  };

  export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { cases } = req.body;
        const skippedCases = [];
  
        for (const caseItem of cases) {
          const existingCase = await prisma.case.findUnique({
            where: { caseId: caseItem.caseId },
          });
  
          if (!existingCase) {
            await prisma.case.create({
              data: {
                caseId: caseItem.caseId,
                patientName: caseItem.patientName,
                requestedAmount: caseItem.requestedAmount,
                requestDate: new Date(caseItem.requestDate),
                status: caseItem.status,
                actions: caseItem.actions,
              },
            });
          } else {
            skippedCases.push(caseItem.caseId); // Add caseId to skipped list
          }
        }
  
        res.status(200).json({ 
          message: 'Cases saved successfully!', 
          skippedCases 
        });
      } catch (error) {
        console.error('Error saving cases:', error);
        res.status(500).json({ error: 'Failed to save cases.' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }