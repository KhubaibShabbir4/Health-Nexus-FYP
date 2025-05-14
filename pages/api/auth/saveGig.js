import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log(req.body);
    const {
      pharmacistId,
      prescriptionId,
      medicationId,
      medicationName,
      quantity,
      price,
      availability,
      deliveryPreference,
      status,
      createdAt,
      patientId,
      pharmacyName
    } = req.body;

    // Validate required fields
    if (
      !pharmacistId || !prescriptionId || !medicationId || !medicationName ||
      !quantity || !price || !availability || !deliveryPreference || !status
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const notification_content = `You can collect your medication from ${pharmacyName} Pharmacy`;
    const notification = await prisma.Notification.create({
      data:{
        user_id : patientId,
        notification_content
      }
    })
    console.log(notification);
    const gig = await prisma.gigDetails.create({
      data: {
        pharmacistId: parseInt(pharmacistId),
        prescriptionId: parseInt(prescriptionId),
        medicationId: medicationId.toString(),
        medicationName,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        availability,
        deliveryPreference,
        status,
        createdAt: createdAt ? new Date(createdAt) : undefined
      },
    });

    return res.status(200).json({ message: 'Gig submitted successfully', gig });
  } catch (error) {
    console.error('Error submitting gig:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
