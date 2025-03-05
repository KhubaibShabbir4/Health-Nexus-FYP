import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const requests = await prisma.aidRequest.findMany();
            res.status(200).json(requests);
        } catch (error) {
            console.error("Database Fetch Error:", error);
            res.status(500).json({ error: "Failed to fetch aid requests" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}