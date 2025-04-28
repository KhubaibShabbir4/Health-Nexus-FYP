import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { id, user_id, appointment_id } = req.body;

    // If specific appointment ID, fetch one prescription
    if (appointment_id) {
      const prescription = await prisma.prescription.findFirst({
        where: { appointment_id: Number(appointment_id) },
      });
      return res.status(200).json(prescription ? [prescription] : []);
    }

    // Otherwise fetch all prescriptions for the user
    const userId = Number(user_id || id);
    if (!userId) {
      return res
        .status(400)
        .json({ error: "Either user_id or appointment_id is required" });
    }

    // Find all appointments + their prescriptions
    const appointments = await prisma.appointment.findMany({
      where: { user_id: userId },
      include: { prescriptions: true },
    });

    // Flatten prescriptions into one array
    const prescriptions = appointments.flatMap((appt) =>
      appt.prescriptions.map((pres) => ({
        ...pres,
        // you can include appointment info too if needed
        // appointment: appt,
      }))
    );

    return res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error in getPrescription:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
