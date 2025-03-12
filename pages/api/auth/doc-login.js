import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Ensure passwords are securely compared
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Fetch doctor from the database
    const doctor = await prisma.Doctor.findUnique({
      where: { email },
    });

    // Check if doctor exists
    if (!doctor) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password with stored password (assuming it's hashed)
    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: doctor.email, id: doctor.id },
      process.env.JWT_SECRET,
      {
        expiresIn: 30 * 60,
      }
    );
    res.setHeader("Set-Cookie", [
      `accesstoken=${token}; HttpOnly; Path=/; Max-Age=${30 * 60}`,
    ]);
    // Login successful
    return res.status(200).json({
      message: "Login successful",
      success: true,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
