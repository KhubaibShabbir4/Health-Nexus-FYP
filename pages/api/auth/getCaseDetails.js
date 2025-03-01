// import prisma from '/lib/prisma'; // Import Prisma client

// export default async function handler(req, res) {
//   const { id } = req.query; // Extract the case ID from the query parameters

//   try {
//     // Fetch case details by ID from the database
//     const caseDetails = await prisma.caseStatus.findUnique({
//       where: {
//         id: Number(id), // Ensure the ID is passed as a number
//       },
//       include: {
//         prescribedMeds: true, // Include prescribed medicines if necessary
//       },
//     });

//     if (!caseDetails) {
//       return res.status(404).json({ error: 'Case not found' }); // Return 404 if the case doesn't exist
//     }

//     return res.status(200).json(caseDetails); // Return the case details as JSON
//   } catch (error) {
//     console.error('Error fetching case details:', error);
//     return res.status(500).json({ error: 'Internal server error' }); // Return 500 error in case of failure
//   }
// }
