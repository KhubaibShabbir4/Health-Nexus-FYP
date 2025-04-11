import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    // 1. Find the pharmacy by its email in the Pharmacy table.
    const pharmacy = await prisma.Pharmacy.findUnique({
      where: { email },
    });

    // 2. If pharmacy is not found, return an unauthorized status.
    if (!pharmacy) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Compare the provided password with the hashed password in the database.
    const isPasswordValid = await bcrypt.compare(password, pharmacy.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. Generate a JWT access token (expires in 30 minutes).
    const token = jwt.sign(
      {
        email: pharmacy.email,
        id: pharmacy.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 30 * 60, // 30 minutes in seconds
      }
    );

    // 5. Generate a JWT refresh token (expires in 7 days).
    const refreshToken = jwt.sign(
      {
        email: pharmacy.email,
        id: pharmacy.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // 6. Set HttpOnly cookies for both the access token and refresh token.
    res.setHeader("Set-Cookie", [
      `accesstoken=${token}; HttpOnly; Path=/; Max-Age=${30 * 60}`,
      `refreshtoken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
    ]);

    // 7. Respond with a success message.
    return res.status(200).json({
      message: "Login successful",
      success: true,
    });
  } catch (error) {
    console.error("Error during pharmacy login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
