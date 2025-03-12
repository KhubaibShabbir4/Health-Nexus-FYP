import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const {
      firstName,
      lastName,
      dob,
      email,
      password,
      specialization,
      licenseNumber,
      experience,
    } = req.body;

    // ✅ Validate required fields
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !email ||
      !password ||
      !specialization ||
      !licenseNumber ||
      !experience
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // ✅ Check if email is already registered
    const existingDoctor = await prisma.doctor.findUnique({ where: { email } });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ error: "Email is already in use. Please log in." });
    }

    // ✅ Check if license number is already registered
    const existingLicense = await prisma.doctor.findUnique({
      where: { licenseNumber },
    });
    if (existingLicense) {
      return res
        .status(400)
        .json({
          error: "License number already exists. Please check your details.",
        });
    }

    // ✅ Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Store new doctor in the database
    const newDoctor = await prisma.doctor.create({
      data: {
        firstName,
        lastName,
        dob: new Date(dob),
        email,
        password: hashedPassword,
        specialization,
        licenseNumber,
        experience: parseInt(experience),
        role: "doctor",
      },
    });

    return res
      .status(201)
      .json({ message: "Doctor registered successfully!", doctor: newDoctor });
  } catch (error) {
    console.error("Doctor Signup Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
