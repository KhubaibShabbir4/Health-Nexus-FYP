// // pages/api/prescribedMedicine.js
// import { prisma } from '/lib/prisma'; // Make sure prisma is correctly set up

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     try {
//       // Fetch all case statuses and their prescribed medicines
//       const cases = await prisma.caseStatus.findMany({
//         include: {
//           prescribedMedicines: true, // Including prescribed medicines related to each case
//         },
//       });
//       res.status(200).json(cases); // Send the cases with their prescribed medicines
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch cases and medicines' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method Not Allowed' }); // Handle unsupported methods
//   }
// }
