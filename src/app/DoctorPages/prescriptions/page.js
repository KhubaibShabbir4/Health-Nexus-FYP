"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header/page";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const PrescriptionPage = () => {
  const [medicines, setMedicines] = useState([
    { name: "", time: "", days: "" },
  ]);
  const [test, setTest] = useState("");
  const [operation, setOperation] = useState("");
  const [instructions, setInstructions] = useState("");
  const [user_id, SetId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", time: "", days: "" }]);
  };

  const updateMedicine = (index, field, value) => {
    setMedicines((prevMedicines) => {
      const updatedMedicines = [...prevMedicines];
      updatedMedicines[index] = {
        ...updatedMedicines[index],
        [field]: value,
      };
      return updatedMedicines;
    });
  };

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const issuePrescription = async () => {
    if (!instructions) {
      alert("Extra Instructions are required!");
      return;
    }

    const prescriptionData = {
      Medicines: JSON.stringify(
        medicines.filter((med) => med.name && med.time && med.days)
      ),
      Tests: test,
      Operations: operation,
      ExtraInstructions: instructions,
      user_id: Number(user_id),
    };

    try {
      setLoading(true);
      const response = await fetch("/api/auth/issuePrescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prescriptionData),
      });

      if (response.ok) {
        setShowSuccessModal(true);
        
        setMedicines([{ name: "", time: "", days: "" }]);
        setTest("");
        setOperation("");
        setInstructions("");
        
        setTimeout(() => {
          router.push("/DoctorPages/doc_landing");
        }, 3000);
      } else {
        alert("Failed to issue prescription.");
      }
    } catch (error) {
      console.error("Error issuing prescription:", error);
      alert("An error occurred while issuing the prescription.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("id");
    SetId(user_id);
  }, []);

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: 'url("/images/doctor.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 2%',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <Header />
      {loading && (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-70 flex justify-center items-center">
          <div className="relative p-4 w-20 h-20">
            <div className="absolute border-4 border-gray-200 w-16 h-16 rounded-full"></div>
            <div className="absolute border-t-4 border-green-600 w-16 h-16 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-green-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Prescription Issued!</h2>
                <p className="text-gray-600 mb-6">Your prescription has been successfully issued to the patient.</p>
                <motion.div 
                  className="h-2 bg-gray-200 rounded-full w-full mb-4 overflow-hidden"
                  initial={{ width: "100%" }}
                >
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-500 to-teal-500"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </motion.div>
                <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
                <button 
                  onClick={() => router.push("/DoctorPages/doc_landing")}
                  className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Go Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 p-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-center text-green-700 mb-6"
        >
          Issue Prescription
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl"
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Medicines
              </h2>
              <button
                onClick={addMedicine}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Medicine
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              {medicines.map((medicine, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 mb-4 p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                    <input
                      type="text"
                      placeholder="Enter medicine name"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Schedule</label>
                    <input
                      type="text"
                      placeholder="e.g., Morning, Afternoon, Night"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={medicine.time}
                      onChange={(e) => updateMedicine(index, "time", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Days"
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={medicine.days}
                      onChange={(e) => updateMedicine(index, "days", e.target.value)}
                    />
                  </div>
                  {medicines.length > 1 && (
                    <button 
                      onClick={() => removeMedicine(index)}
                      className="mt-4 md:mt-0 text-red-500 hover:text-red-700 self-end md:self-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Recommended Tests
              </h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <textarea
                  className="w-full border border-blue-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  rows="3"
                  placeholder="Enter any tests to be performed"
                  value={test}
                  onChange={(e) => setTest(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Operations
              </h2>
              <div className="bg-red-50 p-4 rounded-lg">
                <textarea
                  className="w-full border border-red-200 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
                  rows="3"
                  placeholder="Enter any operations to be performed"
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Special Instructions
            </h2>
            <div className="bg-amber-50 p-4 rounded-lg">
              <textarea
                className="w-full border border-amber-200 p-3 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                rows="4"
                placeholder="Enter any special instructions or advice for the patient"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            onClick={issuePrescription}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transform transition hover:scale-[1.02] font-bold text-lg mt-4 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Issue Prescription
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
