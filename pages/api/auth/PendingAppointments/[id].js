import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const { status } = req.query;
      const appointments = await prisma.appointment.findMany({
        where: { status: status || "Pending" },
        select: {
          id: true,
          appointmentId: true,
          name: true,
          date: true,
          time: true,
          status: true,
          profileImage: true, // Include profile image
        },
      });
      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  } 
  else if (req.method === "PUT") {
    try {
      const { status } = req.body;

      // Update the appointment status in the database
      const updatedAppointment = await prisma.appointment.update({
        where: { id: parseInt(id) },
        data: { status },
      });

      res.status(200).json(updatedAppointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(500).json({ error: "Failed to update appointment status" });
    }
  } 
  else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
