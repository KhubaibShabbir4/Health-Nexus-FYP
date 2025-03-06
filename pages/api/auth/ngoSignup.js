import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, password, registrationNumber, phone, address, mission } = req.body;

    if (!email || !password || !name || !registrationNumber) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    console.log("Checking existing NGO in database...");

    // ✅ Use the correct case: prisma.NGO
    const existingNGO = await prisma.NGO.findUnique({
      where: { email: email },
    });

    if (existingNGO) {
      return res.status(400).json({ error: "Email is already in use. Please log in." });
    }

    const existingRegNumber = await prisma.NGO.findUnique({
      where: { registrationNumber: registrationNumber },
    });

    if (existingRegNumber) {
      return res.status(400).json({ error: "Registration number already exists. Please check your details." });
    }

    // ✅ Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Store NGO details in the database
    const newNGO = await prisma.NGO.create({
      data: {
        name,
        email,
        password: hashedPassword,
        registrationNumber,
        phone,
        address,
        mission,
        role: "ngo",
      },
    });

    return res.status(201).json({ message: "NGO registered successfully!", ngo: newNGO });
  } catch (error) {
    console.error("NGO Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
