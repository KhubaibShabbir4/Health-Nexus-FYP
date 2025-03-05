import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: "Method not allowed" });
        }

        const medications = await prisma.medication.findMany();

        if (!medications || medications.length === 0) {
            console.warn("⚠️ No medications found in the database.");
            return res.status(200).json([]); // Return an empty array instead of null
        }

        res.status(200).json(medications);
    } catch (error) {
        console.error("❌ Database Fetch Error:", error);
        res.status(500).json({ error: "Database connection failed", details: error.message });
    }
}