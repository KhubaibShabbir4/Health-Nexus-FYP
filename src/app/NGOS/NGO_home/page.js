"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer/page";
import Header from "../../components/Header/page";
import { motion } from "framer-motion";

// Chart imports
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";

// Register Chart Components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

export default function NGOHome() {
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [impactValues, setImpactValues] = useState([0, 0, 0, 0]);
  const [monthlyData, setMonthlyData] = useState({
    donations: {
      labels: [],
      data: []
    },
    patients: {
      labels: [],
      data: []
    }
  });
  const router = useRouter();

  // Auto-refresh effect - will refresh the page only once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const hasRefreshed = urlParams.get('refreshed');
      
      if (!hasRefreshed) {
        urlParams.set('refreshed', 'true');
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.location.href = newUrl;
      }
    }
  }, []);

  // Load NGO info and fetch all statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("ngoUser");
        if (!storedUser) {
          console.error("No NGO user found");
          return;
        }

        const userData = JSON.parse(storedUser);
        console.log("Logged in NGO:", userData);
        setNgo(userData);

        // Fetch impact data
        const impactResponse = await fetch(`/api/auth/getImpact?ngoId=${userData.id}`);
        const impactData = await impactResponse.json();
        
        console.log("Impact API Response:", impactData);

        if (impactData.message) {
          console.error("Impact API Error:", impactData.message);
          setImpactValues([0, 0, 0, 0]);
        } else {
          setImpactValues([
            impactData.patientsHelped,
            impactData.fundsDistributed,
            impactData.pendingRequests,
            impactData.avgApprovalTime
          ]);
        }

        // Fetch monthly statistics
        const statsResponse = await fetch(`/api/auth/getMonthlyStats?ngoId=${userData.id}`);
        const statsData = await statsResponse.json();
        
        console.log("Monthly Stats API Response:", statsData);

        if (statsData.message) {
          console.error("Monthly Stats API Error:", statsData.message);
        } else {
          setMonthlyData(statsData);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setImpactValues([0, 0, 0, 0]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pie Chart Config
  const pieData = {
    labels: [
      "Patients Helped",
      "Funds Distributed ($K)",
      "Pending Requests",
      "Avg Approval Time (days)"
    ],
    datasets: [
      {
        data: impactValues,
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#9C27B0"],
        borderColor: ["#388E3C", "#1976D2", "#FFA000", "#7B1FA2"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        }
      }
    }
  };

  // Line Chart Config
  const lineData = {
    labels: monthlyData.donations.labels,
    datasets: [
      {
        label: "Monthly Donations ($)",
        data: monthlyData.donations.data,
        borderColor: "#2196F3",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Donation Trends',
        font: {
          size: 16,
          family: "'Inter', sans-serif"
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Bar Chart Config
  const barData = {
    labels: monthlyData.patients.labels,
    datasets: [
      {
        label: "Patients Helped per Month",
        data: monthlyData.patients.data,
        backgroundColor: "rgba(76, 175, 80, 0.8)",
        borderColor: "#388E3C",
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Patient Statistics',
        font: {
          size: 16,
          family: "'Inter', sans-serif"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-gray-100 relative"
      style={{
        backgroundImage: "url('/images/NGOdash.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Head>
          <title>Health Nexus - Welcome</title>
          <meta name="description" content="Health Nexus NGO Module" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <Header />

        <div className="flex-grow flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-green-600 bg-opacity-90 text-white h-20 flex items-center justify-center text-center shadow-md mt-20"
          >
            <h1 className="text-2xl font-bold">
              Welcome to Health Nexus, {loading ? "Loading..." : ngo?.name || "Guest"}!
            </h1>
          </motion.div>

          <main className="flex-grow p-6">
            <div className="max-w-7xl mx-auto">
              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mb-6">
                <button
                  onClick={() => router.push("/NGOS/Ngo_givingLoan")}
                  className="px-6 py-3 text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <span>View Assistance Requests</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("ngoUser");
                    router.push("/NGOS/login");
                  }}
                  className="px-6 py-3 text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                >
                  <span>Logout</span>
                </button>
              </div>

              {/* Grid layout for charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Impact Overview Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Impact Overview</h2>
                  <div className="aspect-w-16 aspect-h-9">
                    <Pie data={pieData} options={pieOptions} />
                  </div>
                </motion.div>

                {/* Monthly Donations Trend */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Donation Trends</h2>
                  <div className="aspect-w-16 aspect-h-9">
                    <Line data={lineData} options={lineOptions} />
                  </div>
                </motion.div>

                {/* Patient Statistics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Statistics</h2>
                  <div className="h-[400px]">
                    <Bar data={barData} options={barOptions} />
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
