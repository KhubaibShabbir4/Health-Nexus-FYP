import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Use 'nGOImpact' to match your DB model exactly
    const impact = await prisma.nGOImpact.findFirst();

    if (!impact) {
      return res.status(404).json({ message: "No impact data found" });
    }

    return res.status(200).json(impact);
  } catch (error) {
    console.error("Error fetching impact data:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
