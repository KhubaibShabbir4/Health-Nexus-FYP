import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const { name, email, password, licenseNumber, phone, address, services } = req.body;

        // ✅ Check if email or license number already exists
        const existingPharmacy = await prisma.pharmacy.findUnique({ where: { email } });
        if (existingPharmacy) {
            return res.status(400).json({ error: "Email is already in use. Please log in." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newPharmacy = await prisma.pharmacy.create({
            data: {
                name,
                email,
                password: hashedPassword,
                licenseNumber,
                phone,
                address,
                services,
                role: "pharmacy",
            },
        });

        return res.status(201).json({ message: "Pharmacy registered successfully!", pharmacy: newPharmacy });
    } catch (error) {
        console.error("Pharmacy Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
