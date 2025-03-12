"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer/page";
import Header from "../../components/Header/page";
import { motion } from "framer-motion";

export default function NGOHome() {
  const [ngo, setNgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Auto-refresh effect - will refresh the page only once when it's opened
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if the URL already has the refreshed parameter
      const urlParams = new URLSearchParams(window.location.search);
      const hasRefreshed = urlParams.get('refreshed');
      
      if (!hasRefreshed) {
        // Add the refreshed parameter to the URL
        urlParams.set('refreshed', 'true');
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.location.href = newUrl;
      }
    }
  }, []);

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
            <div className="flex w-full max-w-7xl gap-8">
              <div className="flex-1 p-8">
                <h2 className="text-4xl font-bold mb-6 text-green-400">Making Healthcare Accessible</h2>
                <p className="text-xl mb-6 leading-relaxed text-white font-medium">
                  As a trusted NGO partner, you play a vital role in bridging the healthcare gap.
                </p>
              </div>

              <div className="flex-1 p-11 bg-white bg-opacity-90 shadow-lg rounded-2xl text-center">
                <h3 className="text-2xl font-bold text-green-700 mb-8">Manage Your Services</h3>
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
