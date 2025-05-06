import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const patient = await prisma.patientLogin.findUnique({
      where: { patient_id: Number(id) },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({ patient });
  } catch (error) {
    console.error("Error in getPatientDetails:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
} 