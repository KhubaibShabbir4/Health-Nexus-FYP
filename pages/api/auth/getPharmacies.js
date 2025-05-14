// pages/api/auth/getPharmacies.js  (pages router)
// ↳  /api/auth/getPharmacies?ids=3,12,15

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const idsParam = req.query.ids;          // "3,12,15"
  if (!idsParam) {
    return res.status(400).json({ error: 'No ids provided' });
  }

  const ids = idsParam
    .split(',')
    .map((n) => parseInt(n, 10))
    .filter(Boolean);

  try {
    const pharmacies = await prisma.pharmacy.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },     // only what we need
    });
    res.status(200).json({ pharmacies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch pharmacy names' });
  }
}
