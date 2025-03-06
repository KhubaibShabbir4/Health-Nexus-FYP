import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Ensure passwords are securely compared

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
        // Fetch Pharmacy from the database by email
        const pharmacy = await prisma.Pharmacy.findUnique({
            where: { email },
        });

        // Check if Pharmacy exists
        if (!pharmacy) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare password with stored password (assuming it's hashed)
        const isPasswordValid = await bcrypt.compare(password, pharmacy.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Login successful
        return res.status(200).json({
            message: "Login successful",
            pharmacy: {
                id: pharmacy.id,
                name: pharmacy.name,
                email: pharmacy.email,
                phone: pharmacy.phone,
                address: pharmacy.address,
                services: pharmacy.services,
                role: pharmacy.role,
            },
        });
    } catch (error) {
        console.error("Pharmacy Login error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
