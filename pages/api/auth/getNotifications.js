import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Accept patientId from query param for GET requests
    const patient_id = req.method === 'GET' ? Number(req.query.patientId) : req.body.patient_id;

    if (!patient_id) {
      return res.status(400).json({ error: 'Missing patient_id' });
    }

    const notifications = await prisma.Notification.findMany({
      where: { user_id: patient_id },
      orderBy: { id: 'desc' },
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ error: 'Error fetching notifications' });
  }
}
