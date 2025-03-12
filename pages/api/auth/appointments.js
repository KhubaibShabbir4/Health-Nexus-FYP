import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const appointments = await prisma.appointment.findMany();
      return res.status(200).json(appointments);
    }

    if (req.method === "POST") {
      const { name, date, status } = req.body;
      const newAppointment = await prisma.appointment.create({
        data: { name, date: new Date(date), status },
      });
      return res.status(201).json(newAppointment);
    }

    if (req.method === "PUT") {
      const { id, name, date, status } = req.body;
      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: { name, date: new Date(date), status },
      });
      return res.status(200).json(updatedAppointment);
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      await prisma.appointment.delete({ where: { id } });
      return res
        .status(200)
        .json({ message: "Appointment deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
