'use client';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from '../Header/page';
import Footer from '../footer/page';

// Registering ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Report() {
  const [chartData, setChartData] = useState(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/auth/getBarData');
        const data = await response.json();
        setChartData(data); // Set data from API
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true, stacked: true },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutBounce',
    },
  };

  return (
    <div className="page-container">
      <Header />
      <main className="content">
        <div
          className={`graph-container ${hovered ? 'hovered' : ''}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <h2 className="text-2xl font-bold mb-4">Total Funds Transfer</h2>
          {chartData ? (
            <Bar data={chartData} options={options} />
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-500 border-opacity-50"></div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <style jsx>{`
        .page-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .graph-container {
          width: 90%;
          max-width: 1000px;
          padding: 40px;
          background-color: #81c784;
          border-radius: 10px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
