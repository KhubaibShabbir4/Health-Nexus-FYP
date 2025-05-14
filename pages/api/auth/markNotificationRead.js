import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Notification id is required' });
  }

  try {
    // Update notification's "isRead" to true
    const updated = await prisma.Notification.update({
      where: { id: id },
      data: { isRead: true },
    });

    return res.status(200).json({ message: 'Notification marked as read', updated });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ error: 'Error marking notification as read' });
  }
}
