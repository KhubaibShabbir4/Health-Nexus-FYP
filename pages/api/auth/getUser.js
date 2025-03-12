import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const token = req.cookies.accesstoken;

    if (req.method != "GET") {
      return res.status(401).json({ message: "Method not allowed" });
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const patient = await prisma.patientLogin.findUnique({
      where: { patient_id: Number(decoded.id) },
    });

    if (!patient) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ patient: patient });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
