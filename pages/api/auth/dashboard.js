import prisma from '/lib/prisma'; // Ensure the path to your Prisma client is correct

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  try {
    // Aggregate case data grouped by status
    const cases = await prisma.status.groupBy({
      by: ['status'],
      _count: true,
    });

    // Format case data
    const casesData = cases.reduce((acc, { status, _count }) => {
      acc[status] = _count;
      return acc;
    }, {});

    // Aggregate funds data grouped by month
    const funds = await prisma.funds.groupBy({
      by: ['month'],
      _sum: { amount: true },
      orderBy: { month: 'asc' },
    });

    // Format funds data for the chart
    const fundLabels = funds.map((item) => item.month);
    const fundAmounts = funds.map((item) => item._sum.amount);

    const fundDataset = {
      label: 'Funds',
      data: fundAmounts,
      backgroundColor: ['#4CAF50', '#8BC34A', '#388E3C', '#C8E6C9', '#A5D6A7'], // Example color palette
    };

    // Send the response
    res.status(200).json({
      casesFulfilled: casesData.fulfilled || 0,
      activeCases: casesData.active || 0,
      rejectedCases: casesData.rejected || 0,
      funds: {
        labels: fundLabels,
        datasets: [fundDataset],
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
