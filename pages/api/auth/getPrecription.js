import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { id, appointment_id, user_id } = req.body;
      
      // If appointment_id is provided, fetch prescription for that specific appointment
      if (appointment_id) {
        const prescription = await prisma.prescription.findFirst({
          where: { appointment_id: Number(appointment_id) },
          include: {
            appointment: true, // Include appointment details
          },
        });
        return res.status(200).json(prescription || null);
      }
      
      // If user_id is provided, fetch all prescriptions for that user
      // by finding all appointments for the user and their prescriptions
      if (user_id || id) {
        const userId = user_id || id;
        const appointments = await prisma.appointment.findMany({
          where: { user_id: Number(userId) },
          include: {
            prescriptions: true,
          },
        });
        
        // Flatten the prescriptions array
        const prescriptions = appointments.flatMap(appt => 
          appt.prescriptions.map(prescription => ({
            ...prescription,
            appointment: {
              id: appt.id,
              name: appt.name,
              date: appt.date,
              status: appt.status,
              appointmentId: appt.appointmentId,
            }
          }))
        );
        
        return res.status(200).json(prescriptions);
      }
      
      return res.status(400).json({ error: "Either user_id or appointment_id is required" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
