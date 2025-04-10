// pages/api/auth/login.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
    // 🔍 Fetch pharmacy user from the database
    const pharmacy = await prisma.Pharmacy.findUnique({
      where: { email },
    });

    // ❌ Check if pharmacy user exists
    if (!pharmacy) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔐 Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, pharmacy.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🎉 Success Response
    return res.status(200).json({
      message: "Login successful",
      success: true,
    });
  } catch (error) {
    console.error("Pharmacy login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}