import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { user_id, Medicines, Tests, Operations, ExtraInstructions } =
        req.body;

      // First try to find the patient
      let patient = await prisma.patients.findUnique({
        where: { patient_id: Number(user_id) },
      });

      if (!patient) {
        // If patient doesn't exist, try to get appointment details
        const appointment = await prisma.appointment.findFirst({
          where: { user_id: Number(user_id) },
        });

        if (!appointment) {
          return res.status(404).json({
            error: "Patient not found",
            message: "Could not find patient or appointment information",
          });
        }

        // Create a new patient record using appointment information
        patient = await prisma.patients.create({
          data: {
            patient_id: Number(user_id),
            patient_name: appointment.name,
            email: "placeholder@email.com", // You might want to get this from somewhere
            gender: "Not Specified", // You might want to get this from somewhere
            time_slot: appointment.time,
            appointment_date: new Date(appointment.date).toISOString(),
          },
        });
      }

      // Now create the prescription
      const newPrescription = await prisma.prescription.create({
        data: {
          user_id: patient.patient_id,
          Medicines,
          Tests,
          Operations,
          ExtraInstructions,
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
