import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const appointments = await prisma.appointment.findMany();
      return res.status(200).json(appointments);
    }

    if (req.method === 'POST') {
      const { id, appointmentId, name, date, time, status, profileImage } = req.body;

      // 🛠 If an ID is provided, this means it's an undo operation.
      if (id) {
        // Check if the appointment already exists
        const existingAppointment = await prisma.appointment.findUnique({ where: { id } });

        if (existingAppointment) {
          return res.status(400).json({ error: "Appointment already exists!" });
        }

        // Restore the deleted appointment with its original ID
        const restoredAppointment = await prisma.appointment.create({
          data: {
            id,
            appointmentId,
            name: name || "Unknown",
            date: date ? new Date(date) : new Date(),
            time: time || "00:00 AM",
            status: status || "Pending",
            profileImage: profileImage || null,
          },
        });

        return res.status(201).json(restoredAppointment);
      }

      // 🛠 Normal "Add New Appointment" Flow
      const safeName = name || "Unknown";
      const safeDate = date ? new Date(date) : new Date();
      const safeTime = time || "00:00 AM";
      const safeStatus = status || "Pending";
      const safeProfileImage = profileImage || null;

      // Generate a unique appointmentId (e.g., "A123")
      const lastAppointment = await prisma.appointment.findFirst({
        orderBy: { id: 'desc' },
      });

      const lastIdNumber = lastAppointment
        ? parseInt(lastAppointment.appointmentId.replace('A', ''), 10)
        : 0;

      const newAppointmentId = `A${lastIdNumber + 1}`;

      const newAppointment = await prisma.appointment.create({
        data: {
          appointmentId: newAppointmentId,
          name: safeName,
          date: safeDate,
          time: safeTime,
          status: safeStatus,
          profileImage: safeProfileImage,
        },
      });

      return res.status(201).json(newAppointment);
    }

    // 🛠 ✅ Add PUT method for editing appointment
    if (req.method === 'PUT') {
      const { id, name, date, time, status } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Appointment ID is required for updating" });
      }

      const existingAppointment = await prisma.appointment.findUnique({ where: { id } });

      if (!existingAppointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: {
          name: name || existingAppointment.name,
          date: date ? new Date(date) : existingAppointment.date,
          time: time || existingAppointment.time,
          status: status || existingAppointment.status,
        },
      });

      return res.status(200).json(updatedAppointment);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "Appointment ID is required for deletion" });

      await prisma.appointment.delete({ where: { id } });
      return res.status(200).json({ message: "Appointment deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
