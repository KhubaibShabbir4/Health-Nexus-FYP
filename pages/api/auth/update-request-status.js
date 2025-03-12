import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, status, reason, ngoAmount } = req.body;

    try {
      const updatedRequest = await prisma.assistanceRequest.update({
        where: { id: parseInt(id) },
        data: {
          Status: status,
          Reason: reason,
          ngoAmount: ngoAmount ? parseFloat(ngoAmount) : null,
        },
      });

      return res.status(200).json(updatedRequest);
    } catch (error) {
      console.error("Error updating request status:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
