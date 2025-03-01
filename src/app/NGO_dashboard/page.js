'use client';
import Head from 'next/head';
import Header from '../Header/page'; // Import the Header component
import Footer from '../footer/page';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const [doughnutData, setDoughnutData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Set default to the current year

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/auth/dashboard');
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();

        // Update the year dynamically if the API provides a year value
        if (data.currentYear) {
          setCurrentYear(data.currentYear);
        }

        setDoughnutData({
          labels: ['Cases Fulfilled', 'Active Cases', 'Rejected Cases'],
          datasets: [
            {
              data: [data.casesFulfilled, data.activeCases, data.rejectedCases],
              backgroundColor: ['#8BC34A', '#4CAF50', '#BDBDBD'],
              hoverBackgroundColor: ['#76A346', '#388E3C', '#9E9E9E'],
            },
          ],
        });

        setBarData({
          labels: data.funds.labels,
          datasets: data.funds.datasets,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Health Nexus - Dashboard</title>
        <meta name="description" content="Health Nexus NGO Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header />

      <main className="flex-grow bg-gray-50 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Case Analysis Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Case Analysis</h3>
            {doughnutData ? (
              <Doughnut data={doughnutData} />
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
          </div>

          {/* Funds Analysis Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Funds Analysis (Year {currentYear})</h3>
            {barData ? (
              <Bar data={barData} />
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
          </div>

          {/* View Report Card */}
          <a
            href="/NGO_report"
            className="bg-green-100 hover:bg-green-200 transition rounded-lg shadow-md p-6 flex items-center justify-center text-center"
          >
            <div>
              <h3 className="text-lg font-bold">View Report</h3>
              <div className="text-3xl mt-2">📄</div>
            </div>
          </a>

          {/* View Patient Profile Card */}
          <a
            href="/Patient_profile"
            className="bg-green-100 hover:bg-green-200 transition rounded-lg shadow-md p-6 flex items-center justify-center text-center"
          >
            <div>
              <h3 className="text-lg font-bold">View Patient Profile</h3>
              <div className="text-3xl mt-2">👤</div>
            </div>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
