import prisma from '/lib/prisma'; // Import Prisma client

export const config = {
    runtime: 'nodejs',
  };
  

export default async function handler(req, res) {
    try {
      // Use groupBy to aggregate data by category and month
      const funds = await prisma.fundsTransfer.groupBy({
        by: ['category', 'month'],
        _sum: { amount: true },
        orderBy: { month: 'asc' },
      });
  
      // Format the data for the chart
      const groupedData = {};
      funds.forEach(({ category, month, _sum }) => {
        if (!groupedData[category]) groupedData[category] = [];
        groupedData[category].push({ month, amount: _sum.amount });
      });
  
      const labels = [...new Set(funds.map((item) => item.month))];
      const datasets = Object.keys(groupedData).map((category) => ({
        label: category,
        data: labels.map((month) =>
          groupedData[category].find((entry) => entry.month === month)?.amount || 0
        ),
        backgroundColor: category === 'Pharmacy' ? '#B3E5FC' : '#C8E6C9', // Example colors
      }));
  
      res.status(200).json({ labels, datasets });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }