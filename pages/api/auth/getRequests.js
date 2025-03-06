import { PrismaClient } from "@prisma/client";
import { decryptData } from "../../../utils/encryption"; // Import decryption function

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const requests = await prisma.assistanceRequest.findMany();

            // Decrypt medical condition for each request
            const decryptedRequests = requests.map(request => ({
                ...request,
                medicalCondition: decryptData(request.medicalCondition) // Decrypt before sending
            }));

            res.status(200).json(decryptedRequests);
        } catch (error) {
            console.error("Error fetching requests:", error);
            res.status(500).json({ error: "Failed to fetch assistance requests." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
