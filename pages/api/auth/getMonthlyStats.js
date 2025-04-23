import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get NGO ID from query parameter
    const ngoId = parseInt(req.query.ngoId);
    console.log("Request query:", req.query);
    console.log("Parsed NGO ID:", ngoId);

    if (!ngoId) {
      console.log("No NGO ID provided");
      return res.status(400).json({ message: "NGO ID is required" });
    }

    // Get last 6 months of donations
    const donations = await prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM month) as month_num,
        TO_CHAR(month, 'Month') as month_name,
        amount
      FROM "NGOMonthlyDonation"
      WHERE "ngoId" = ${ngoId}
      AND month >= NOW() - INTERVAL '6 months'
      ORDER BY month ASC;
    `;

    // Get last 6 months of patient counts
    const patients = await prisma.$queryRaw`
      SELECT 
        EXTRACT(MONTH FROM month) as month_num,
        TO_CHAR(month, 'Month') as month_name,
        "patientCount"
      FROM "NGOMonthlyPatient"
      WHERE "ngoId" = ${ngoId}
      AND month >= NOW() - INTERVAL '6 months'
      ORDER BY month ASC;
    `;

    console.log("Raw donations query result:", donations);
    console.log("Raw patients query result:", patients);

    // Format the response
    const response = {
      donations: {
        labels: donations.map(d => d.month_name.trim()),
        data: donations.map(d => parseFloat(d.amount) || 0)
      },
      patients: {
        labels: patients.map(p => p.month_name.trim()),
        data: patients.map(p => parseInt(p.patientCount) || 0)
      }
    };

    // If no data found, provide default data structure
    if (donations.length === 0 && patients.length === 0) {
      const defaultMonths = ['January', 'February', 'March', 'April', 'May', 'June'];
      response.donations = {
        labels: defaultMonths,
        data: [0, 0, 0, 0, 0, 0]
      };
      response.patients = {
        labels: defaultMonths,
        data: [0, 0, 0, 0, 0, 0]
      };
    }

    console.log("Sending response:", response);
    return res.status(200).json(response);

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch monthly statistics",
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
} 