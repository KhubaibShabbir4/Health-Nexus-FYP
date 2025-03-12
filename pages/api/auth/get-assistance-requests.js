import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      if (id) {
        // Fetch a specific request by user ID
        const request = await prisma.assistanceRequest.findMany({
          where: { user_id: parseInt(id) },
        });

        if (!request) {
          return res.status(404).json({ error: "Request not found" });
        }

        return res.status(200).json(request);
      } else {
        // Fetch all requests
        const requests = await prisma.assistanceRequest.findMany({
          orderBy: { createdAt: "desc" },
        });

        return res.status(200).json(requests);
      }
    } catch (error) {
      console.error("Error fetching assistance requests:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
