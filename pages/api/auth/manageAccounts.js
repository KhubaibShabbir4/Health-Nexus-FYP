import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      console.log("Fetching accounts...");
      const accounts = await prisma.manageAccount.findMany();
      return res.status(200).json(accounts);
    }

    if (req.method === 'POST') {
      const { name, email, password, role, phone, cnic, address, city, gender, time_slot, appointment_date } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // ✅ Save Account in ManageAccount Table
      const newAccount = await prisma.manageAccount.create({
        data: { name, email, password, role },
      });

      // ✅ If Role is Patient, Also Save in patientSignup Table
      if (role === "Patient") {
        await prisma.patientSignup.create({
          data: {
            patient_name: name,
            patient_email: email,
            password,
            email, // Duplicate to match schema
            phone: phone || "N/A",
            cnic: cnic || "N/A",
            address: address || "Not provided",
            city: city || "Not specified",
            gender: gender || "Unknown",
            time_slot: time_slot || "Not assigned",
            appointment_date: appointment_date || "Not scheduled",
          },
        });
      }

      return res.status(201).json(newAccount);
    }

    if (req.method === 'PUT') {
      const { id, name, email, password, role } = req.body;
      if (!id) return res.status(400).json({ error: "ID is required" });

      const updatedAccount = await prisma.manageAccount.update({
        where: { id: Number(id) },
        data: { name, email, password, role },
      });

      return res.status(200).json(updatedAccount);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "ID is required" });

      await prisma.manageAccount.delete({ where: { id: Number(id) } });

      return res.status(200).json({ message: "Account deleted successfully" });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
