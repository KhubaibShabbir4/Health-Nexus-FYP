// pages/api/auth/pharmacySignup.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, password, licenseNumber, address, phone, services, role } = req.body;

  // Basic Validation
  if (!name || !email || !password || !licenseNumber || !address || !phone || !services) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if pharmacy already exists
    const existingPharmacy = await prisma.pharmacy.findUnique({
      where: { email },
    });

    if (existingPharmacy) {
      return res.status(409).json({ error: 'Pharmacy with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new pharmacy
    await prisma.pharmacy.create({
      data: {
        name,
        email,
        password: hashedPassword,
        licenseNumber,
        address,
        phone,
        services,
        role: role || 'pharmacy',
      },
    });

    return res.status(201).json({ message: 'Pharmacy registered successfully' });
  } catch (error) {
    console.error('Pharmacy signup error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
