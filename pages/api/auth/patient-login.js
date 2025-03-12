import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    // Look for the patient using the email in the patient-signup table.
    const patient = await prisma.PatientLogin.findUnique({
      where: { email },
    });

    if (!patient) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the given password with the hashed password in the database.
    const isPasswordValid = await bcrypt.compare(
      password,
      patient.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { email: patient.email, id: patient.patient_id },
      process.env.JWT_SECRET,
      {
        expiresIn: 30 * 60,
      }
    );

    // Generate a refresh token
    const refreshToken = jwt.sign(
      { email: patient.email, id: patient.patient_id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // 7 days expiration for refresh token
      }
    );
    // Set cookies for access token and refresh token
    res.setHeader("Set-Cookie", [
      `accesstoken=${token}; HttpOnly; Path=/; Max-Age=${30 * 60}`,
      `refreshtoken=${refreshToken}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }`,
    ]);

    // Respond with success if credentials are valid.
    return res.status(200).json({
      message: "Login successful",
      success: true,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
