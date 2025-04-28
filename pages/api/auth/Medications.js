import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            // Get user_id from query parameter
            const { user_id } = req.query;
            
            // If no user_id provided, return error
            if (!user_id) {
                return res.status(400).json({ error: "Missing user_id parameter" });
            }

            // Find all prescriptions for the specified user
            const medications = await prisma.prescription.findMany({
                where: {
                    user_id: parseInt(user_id)
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            if (!medications || medications.length === 0) {
                console.warn(`⚠️ No medications found for user ID: ${user_id}`);
                return res.status(200).json([]); // Return an empty array instead of null
            }

            res.status(200).json(medications);
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("❌ Database Fetch Error:", error);
        res.status(500).json({ error: "Database connection failed", details: error.message });
    }
}