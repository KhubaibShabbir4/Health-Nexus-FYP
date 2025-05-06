// pages/api/gigDetails.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    medicationId,
    prescriptionId,
    pharmacistId,
    quantity,
    price,
    availability,
    deliveryPreference,
    patientName
  } = req.body;

  // Basic validation
  if (
    !medicationId ||
    !prescriptionId ||
    !pharmacistId ||
    !quantity ||
    !price ||
    !availability ||
    !deliveryPreference
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Adjust field names to match your Prisma model
    const newGig = await prisma.gigDetails.create({
      data: {
        medicationId: Number(medicationId),
        prescriptionId: Number(prescriptionId),
        pharmacistId: Number(pharmacistId),
        gigAmount: Number(quantity) * Number(price),  // if you store total amount
        quantity: Number(quantity),
        price: Number(price),
        availability,
        deliveryPreference,
        patientName,
        status: 'available',
        createdAt: new Date()
      }
    });

    return res.status(201).json(newGig);
  } catch (error) {
    console.error('Prisma create error:', error);
    return res.status(500).json({ error: 'Failed to save gig details' });
  }
}
