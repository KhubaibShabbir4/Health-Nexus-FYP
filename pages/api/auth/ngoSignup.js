import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import formidable from "formidable";
import fs from "fs";
import path from "path";

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

// Disable bodyParser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({ multiples: false, keepExtensions: true });
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Parse form data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ error: "Error processing the upload." });
      }

      console.log("Fields:", fields);
      console.log("Files:", files);

      const { name, email, password, registrationNumber, phone, address, mission } = fields;

      if (!name || !email || !password || !registrationNumber || !phone || !address || !mission) {
        return res.status(400).json({ error: "All fields are required except the NGO logo." });
      }

      console.log("Checking existing NGO in database...");

      const emailCheck = email.toString().trim();
      const regNumberCheck = registrationNumber.toString().trim();

      // Check if email is already registered
      const existingNGO = await prisma.nGO.findUnique({
        where: { email: emailCheck },
      });

      if (existingNGO) {
        return res.status(400).json({ error: "Email is already in use. Please log in." });
      }

      // Check if registration number exists
      const existingRegNumber = await prisma.nGO.findUnique({
        where: { registrationNumber: regNumberCheck },
      });

      if (existingRegNumber) {
        return res.status(400).json({ error: "Registration number already exists. Please check your details." });
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password.toString(), 10);

      let logoUrl = null;

      // ✅ If logo is uploaded, process it safely
      if (files.logo) {
        const logoFile = Array.isArray(files.logo) ? files.logo[0] : files.logo;

        if (logoFile && logoFile.filepath) {
          const fileExt = path.extname(logoFile.originalFilename || logoFile.newFilename).toLowerCase();
          const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];

          if (!validExtensions.includes(fileExt)) {
            return res.status(400).json({ error: "Invalid logo file type. Please upload a JPG, PNG, or GIF." });
          }

          const fileName = `${Date.now()}-${logoFile.originalFilename || logoFile.newFilename}`;
          const savePath = path.join(uploadDir, fileName);

          // ✅ Fix for "EXDEV: cross-device link not permitted"
          fs.copyFileSync(logoFile.filepath, savePath); // Copy the file
          fs.unlinkSync(logoFile.filepath); // Delete original temporary file

          // Set logo URL for database storage (public URL)
          logoUrl = `/uploads/${fileName}`;
        }
      }

      // ✅ Store NGO details in the database
      const newNGO = await prisma.nGO.create({
        data: {
          name: name.toString(),
          email: emailCheck,
          password: hashedPassword,
          registrationNumber: regNumberCheck,
          phone: phone.toString(),
          address: address.toString(),
          mission: mission.toString(),
          role: "ngo"
        },
      });

      return res.status(201).json({ message: "NGO registered successfully!", ngo: newNGO });
    });
  } catch (error) {
    console.error("NGO Signup Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
