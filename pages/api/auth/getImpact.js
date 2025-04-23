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

    // Get impact data for specific NGO using raw query to debug
    const impact = await prisma.$queryRaw`
      SELECT "patientsHelped", "fundsDistributed", "pendingRequests", "avgApprovalTime"
      FROM "nGOImpact"
      WHERE "ngold" = ${ngoId}
      ORDER BY "createdAt" DESC
      LIMIT 1;
    `;

    console.log("Raw query result:", impact);

    if (!impact || impact.length === 0) {
      console.log("No impact data found for NGO ID:", ngoId);
      return res.status(200).json({
        patientsHelped: 0,
        fundsDistributed: 0,
        pendingRequests: 0,
        avgApprovalTime: 0
      });
    }

    const data = impact[0];
    const response = {
      patientsHelped: parseInt(data.patientsHelped) || 0,
      fundsDistributed: parseInt(data.fundsDistributed) || 0,
      pendingRequests: parseInt(data.pendingRequests) || 0,
      avgApprovalTime: parseInt(data.avgApprovalTime) || 0
    };

    console.log("Sending response:", response);
    return res.status(200).json(response);

  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ 
      message: "Failed to fetch impact data",
      error: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
} 