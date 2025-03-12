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
        // Fetch NGO from the database by email
        const ngo = await prisma.NGO.findUnique({
            where: { email },
        });

        // Check if NGO exists
        if (!ngo) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Compare password with stored password (assuming it's hashed)
        const isPasswordValid = await bcrypt.compare(password, ngo.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Login successful
        return res.status(200).json({
            message: "Login successful",
            ngo: {
                id: ngo.id,
                name: ngo.name,
                email: ngo.email,
                role: ngo.role,
                phone: ngo.phone,
                address: ngo.address,
                mission: ngo.mission,
            },
        });
    } catch (error) {
        console.error("NGO Login error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}