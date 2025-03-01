import { prisma } from '/lib/prisma';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  try {
    console.log('Fetching ratings from database...');

    // Fetch ratings (adjust findFirst or findMany based on requirements)
    const ratings = await prisma.ratings.findFirst({
      select: {
        satisfaction: true,
        diagnosis: true,
        staffBehaviour: true,
        environment: true,
      },
    });

    if (!ratings) {
      console.error('No ratings found in the database');
      return res.status(404).json({ message: 'No ratings available' });
    }

    console.log('Ratings fetched:', ratings);
    return res.status(200).json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return res.status(500).json({
      message: 'Failed to fetch ratings',
      error: error.message,
    });
  }
}
