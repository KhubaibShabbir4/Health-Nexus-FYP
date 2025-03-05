import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { email, password } = req.body;

      // 🔹 Validate inputs
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required!" });
      }

      // 🔹 Check if admin exists
      const admin = await prisma.admin.findUnique({ where: { email } });

      if (!admin) {
        return res.status(401).json({ error: "No account found with this email" });
      }

      // 🔹 Verify password
      if (admin.password !== password) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      return res.status(200).json({ message: "Login successful", admin });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Login API Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
