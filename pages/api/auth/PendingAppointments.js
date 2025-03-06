import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { status } = req.query;
      const appointments = await prisma.appointment.findMany({
        where: { status: status || "Pending" },
        select: {
          id: true,
          appointmentId: true,
          name: true,
          email: true, // ✅ Fetch email
          phoneNumber: true, // ✅ Fetch phone number
          date: true,
          time: true,
          status: true,
          profileImage: true, // ✅ Include profile image
        },
      });
      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
