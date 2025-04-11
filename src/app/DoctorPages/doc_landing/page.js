"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorHeader from "../../components/Header/page";
import Footer from "../../components/footer/page";

const DoctorLanding = () => {
  const [doctor, setDoctor] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getDoctor = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/get-doc", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Doctor Data:", data); // Debugging
        setDoctor(data.doctor);
      } else {
        router.push("/Doctor/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/Doctor/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctor();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <DoctorHeader />
      {loading && (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-70 flex justify-center items-center">
          <div className="relative p-4 w-48 h-48 flex justify-center items-center">
            <div className="absolute border-4 border-gray-400 w-36 h-36 rounded-full"></div>
            <div className="absolute border-t-4 border-blue-400 w-36 h-36 rounded-full animate-spin "></div>
          </div>
        </div>
      )}
      <div
        className="w-full bg-green-600 text-white h-20 flex items-center justify-center text-center shadow-md mt-20 
        transition-transform transform duration-700 ease-out animate-fadeIn"
      >
        <h1 className="text-2xl font-bold">Welcome to Health Nexus!</h1>
      </div>
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-4xl p-11 bg-white shadow-lg rounded-2xl text-center transition-transform transform hover:scale-105 text-gray-900">
          <p className="mt-4 text-xl font-extrabold text-green-700">
            {doctor.firstName && doctor.lastName
              ? `Dr. ${doctor.firstName} ${doctor.lastName}`
              : "Fetching Doctor Details..."}
          </p>

          {/* ✅ Displaying the specialization dynamically */}
          <p className="mt-4 text-xl font-semibold text-green-700">
            {doctor.specialization
              ? ` ${doctor.specialization}`
              : "Specialization not available"}
          </p>

          <div className="flex space-x-4 mt-6">
            <button
              onClick={() =>
                router.push(`/DoctorPages/todays_appointment?id=${doctor.id}`)
              }
              className="w-full px-6 py-2 text-lg bg-green-600 text-white rounded-lg hover:bg-green-800"
            >
              Show Appointments
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorLanding;