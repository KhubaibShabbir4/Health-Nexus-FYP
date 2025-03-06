import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { firstName, lastName, dob, email, password, role } = req.body;

      // 🔹 Validation: Ensure all fields are filled
      if (!firstName || !lastName || !dob || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
      }

      // 🔹 Convert DOB to DateTime format
      const formattedDob = new Date(dob);

      // 🔹 Create new Admin in the database
      const newAdmin = await prisma.admin.create({
        data: { firstName, lastName, dob: formattedDob, email, password, role },
      });

      return res.status(201).json(newAdmin);
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
