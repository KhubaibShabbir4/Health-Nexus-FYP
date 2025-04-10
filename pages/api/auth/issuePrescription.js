import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { user_id, Medicines, Tests, Operations, ExtraInstructions } =
        req.body;
      const newPrescription = await prisma.prescription.create({
        data: { user_id, Medicines, Tests, Operations, ExtraInstructions },
      });
      return res.status(201).json(newPrescription);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
