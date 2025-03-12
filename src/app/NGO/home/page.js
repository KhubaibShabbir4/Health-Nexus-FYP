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

  useEffect(() => {
    const fetchNGO = async () => {
      try {
        const storedUser = localStorage.getItem("ngoUser");
        console.log("Stored User:", storedUser);

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log("Parsed User Data:", userData);

          if (userData && userData.id) {
            setNgo(userData);  // ✅ Directly set the stored NGO data
          } else {
            console.error("No valid ID found in localStorage");
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Head>
        <title>Health Nexus - Welcome</title>
        <meta name="description" content="Health Nexus NGO Module" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <Header />

      {/* Welcome Banner (Fully Centered) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-green-600 text-white h-20 flex items-center justify-center text-center shadow-md mt-20"
      >
        <h1 className="text-2xl font-bold">
          Welcome to Health Nexus, {loading ? "Loading..." : ngo?.name || "Guest"}!
        </h1>
      </motion.div>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-4xl p-11 bg-white shadow-lg rounded-2xl text-center transition-transform transform hover:scale-105 text-gray-900">
          <p className="mt-4 text-xl font-extrabold text-green-700">
          </p>
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => router.push("/NGOS/Ngo_givingLoan")}
              className="w-full px-6 py-2 text-lg bg-green-600 text-white rounded-lg hover:bg-green-800"
            >
              Show Appointments
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}