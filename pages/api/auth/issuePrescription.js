import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { appointment_id, Medicines, Tests, Operations, ExtraInstructions } =
        req.body;
      
      // Validate that appointment_id is provided
      if (!appointment_id) {
        return res.status(400).json({ error: "appointment_id is required" });
      }

      const newPrescription = await prisma.prescription.create({
        data: { 
          appointment_id: Number(appointment_id), 
          Medicines, 
          Tests, 
          Operations, 
          ExtraInstructions 
        },
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
