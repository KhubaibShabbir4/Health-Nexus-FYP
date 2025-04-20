"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer/page";
import Header from "../../components/Header/page";
import { motion } from "framer-motion";

// Pie chart imports
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Pie Chart Components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function NGOHome() {
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [impactValues, setImpactValues] = useState([0, 0, 0, 0]);
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

  // Load NGO info (optional; not used for chart)
  useEffect(() => {
    const fetchNGO = async () => {
      try {
        const storedUser = localStorage.getItem("ngoUser");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData && userData.id) {
            setNgo(userData);
          }
        }
      } catch (error) {
        console.error("Error fetching NGO details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNGO();
  }, []);

  // ✅ Dynamic fetch for pie chart
  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const response = await fetch("/api/auth/getImpact");
        const data = await response.json();
    
        console.log("🔍 Fetched impact data:", data); // <== ADD THIS LOG
    
        if (response.ok) {
          setImpactValues([
            data.patientsHelped,
            data.fundsDistributed,
            data.pendingRequests,
            data.avgApprovalTime,
          ]);
        } else {
          console.error("Failed to fetch impact data:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    

    fetchImpactData();
  }, []);

  // Chart config
  const impactLabels = [
    "Patients Helped",
    "Funds Distributed ($K)",
    "Pending Requests",
    "Avg Approval Time (weeks)",
  ];

  const impactColors = ["#4CAF50", "#FFC107", "#FF5722", "#673AB7"];

  const impactData = {
    labels: impactLabels,
    datasets: [
      {
        label: "NGO Impact",
        data: impactValues,
        backgroundColor: impactColors,
        borderColor: ["#388E3C", "#FFA000", "#E64A19", "#512DA8"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
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

          <main className="flex-grow flex flex-col items-center justify-center p-6">
            <div className="flex w-full max-w-7xl gap-8 flex-wrap md:flex-nowrap">
              <div className="flex-1 p-8">
                <h2 className="text-4xl font-bold mb-6 text-green-400">Making Healthcare Accessible</h2>
                <p className="text-xl mb-6 leading-relaxed text-white font-medium">
                  As a trusted NGO partner, you play a vital role in bridging the healthcare gap.
                </p>
              </div>

              <div className="flex-1 p-11 bg-white bg-opacity-90 shadow-lg rounded-2xl text-center">
                <h3 className="text-2xl font-bold text-green-700 mb-6">Manage Your Services</h3>

                {/* Pie chart and legend in one row */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8">
                  {/* Pie Chart */}
                  <div className="w-[250px] h-[250px] md:w-[300px] md:h-[300px]">
                    <Pie data={impactData} options={options} />
                  </div>

                  {/* Legend */}
                  <ul className="text-left space-y-2 text-sm font-medium">
                    {impactLabels.map((label, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 inline-block rounded-sm"
                          style={{ backgroundColor: impactColors[index] }}
                        ></span>
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buttons */}
                <div className="flex flex-col space-y-6">
                  <button
                    onClick={() => router.push("/NGOS/Ngo_givingLoan")}
                    className="w-full px-6 py-4 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  >
                    View Appointments
                  </button>

                  <button
                    onClick={() => {
                      localStorage.removeItem("ngoUser");
                      router.push("/NGO/login");
                    }}
                    className="w-full px-6 py-4 text-lg bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
