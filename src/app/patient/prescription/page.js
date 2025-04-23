"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Page = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`/api/auth/getPrescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPrescriptions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching prescriptions:", error);
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("id");
    setId(user_id);
  }, []);

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: 'url("/images/doctor.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-extrabold text-green-700 sm:text-4xl">
            <span className="block">Your Medical Prescriptions</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Track your medication, tests, and doctor's instructions.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative p-4 w-20 h-20">
              <div className="absolute border-4 border-gray-200 w-16 h-16 rounded-full"></div>
              <div className="absolute border-t-4 border-green-600 w-16 h-16 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            {prescriptions.map((prescription, idx) => (
              <motion.div
                key={prescription.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white rounded-lg shadow-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      Prescription #{prescription.id}
                    </h2>
                    <div className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm text-white font-medium">
                      {new Date(prescription.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Prescribed Medicines
                    </h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      {JSON.parse(prescription.Medicines).map((medicine, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-200 last:border-0">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <span className="text-green-600 font-semibold">{index + 1}</span>
                            </div>
                            <span className="font-medium text-gray-800">{medicine.name}</span>
                          </div>
                          <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row sm:items-center text-sm">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                              {medicine.time}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded mt-1 sm:mt-0">
                              {medicine.days} days
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {prescription.Tests && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Recommended Tests
                      </h3>
                      <div className="bg-blue-50 p-4 rounded-lg text-blue-900">
                        {prescription.Tests}
                      </div>
                    </div>
                  )}

                  {prescription.Operations && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Operations
                      </h3>
                      <div className="bg-red-50 p-4 rounded-lg text-red-900">
                        {prescription.Operations}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Doctor's Instructions
                    </h3>
                    <div className="bg-amber-50 p-4 rounded-lg text-amber-900">
                      {prescription.ExtraInstructions}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No prescriptions found</h3>
            <p className="mt-1 text-sm text-gray-500">You don't have any prescriptions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
