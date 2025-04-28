"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const MedicationStatus = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePrescription, setActivePrescription] = useState(null);
  const router = useRouter();

  // Get patient ID from session or URL parameter as fallback
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        // First try to get the patient ID from the session
        const sessionResponse = await fetch('/api/auth/getPatientSession');
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          if (sessionData && sessionData.patient_id) {
            console.log("Retrieved patient_id from session:", sessionData.patient_id);
            setId(Number(sessionData.patient_id));
            return;
          }
        } else {
          console.log("Could not get patient ID from session, trying getUser API");
          
          // Try to get the patient ID from the getUser API as a fallback
          const userResponse = await fetch("/api/auth/getUser");
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData && userData.patient && userData.patient.patient_id) {
              console.log("Retrieved patient_id from getUser API:", userData.patient.patient_id);
              setId(Number(userData.patient.patient_id));
              return;
            }
          } else {
            // Check localStorage for patient ID
            const localPatientId = localStorage.getItem('patientId');
            if (localPatientId) {
              console.log("Retrieved patient_id from localStorage:", localPatientId);
              setId(Number(localPatientId));
              return;
            }
            
            // If localStorage fails, try URL parameter
            const params = new URLSearchParams(window.location.search);
            const user_id = params.get("id");
            console.log("Fallback: Received user_id from URL:", user_id);
            
            if (user_id) {
              setId(Number(user_id));
              return;
            }
            
            // If all methods fail, redirect to login
            console.error("No patient ID found in session, API, localStorage, or URL parameters");
            setError("Unable to identify patient. Please log in again.");
            setTimeout(() => {
              router.push("/patient/login");
            }, 3000);
          }
        }
      } catch (err) {
        console.error("Error fetching patient ID:", err);
        setError("Error loading patient information. Please try again later.");
      }
    };

    fetchPatientId();
  }, [router]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      console.log("Fetching prescriptions for id:", id);
      
      // First fetch prescriptions
      fetch(`/api/auth/getPrescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Received prescription data:", data);
          if (!data || data.length === 0) {
            console.log("No prescriptions found for this user");
            setLoading(false);
            return;
          }
          setPrescriptions(data);
          
          // Now fetch all medications for this user ID
          return fetch(`/api/auth/Medications?user_id=${id}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(medicationsData => {
              console.log("Received medications data:", medicationsData);
              
              // Process all medications from all prescriptions
              if (medicationsData && medicationsData.length > 0) {
                let allMedications = [];
                
                // Process each prescription's medicines
                medicationsData.forEach(prescription => {
                  try {
                    const meds = JSON.parse(prescription.Medicines);
                    console.log("Parsed medicines from prescription:", prescription.id, meds);
                    
                    const processedMeds = meds.map((med, index) => {
                      const times = med.time.split(",").length;
                      const total = times * parseInt(med.days);
                      const createdAt = new Date(prescription.createdAt);
                      const now = new Date();
                      const diffDays = Math.floor(
                        (now - createdAt) / (1000 * 60 * 60 * 24)
                      );
                      const stock = Math.max(0, total - diffDays * times);
                      return { 
                        ...med, 
                        total, 
                        stock, 
                        id: `${prescription.id}-${index}`,
                        prescriptionId: prescription.id,
                        prescriptionDate: createdAt
                      };
                    });
                    
                    allMedications = [...allMedications, ...processedMeds];
                  } catch (error) {
                    console.error("Error parsing medicines for prescription:", prescription.id, error);
                  }
                });
                
                // Sort medications by most recent prescription first
                allMedications.sort((a, b) => b.prescriptionDate - a.prescriptionDate);
                setMedications(allMedications);
              }
            });
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching prescriptions or medications:", error);
          setError("Error loading medications. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("No id available to fetch medications");
    }
  }, [id]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");
      medications.forEach((med) => {
        if (med.dosageTime === currentTime) {
          alert(`Time to take your ${med.name}`);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [medications]);

  // Map real prescription IDs to sequential display numbers (1-indexed)
  const getPrescriptionDisplayNumber = (realId) => {
    if (!prescriptions || prescriptions.length === 0) return 1;
    
    // Sort prescriptions by creation date (oldest first)
    const sortedPrescriptions = [...prescriptions].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    
    // Find the index of the prescription with this ID in the sorted array
    const index = sortedPrescriptions.findIndex(p => p.id === realId);
    
    // Return 1-indexed position (add 1 to 0-indexed position)
    return index !== -1 ? index + 1 : 1;
  };

  const filteredMedications = activePrescription 
    ? medications.filter(med => med.prescriptionId === activePrescription)
    : medications;

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: 'url("/images/medsta.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="max-w-6xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-extrabold text-green-700 sm:text-4xl mb-4 sm:mb-0">
            My Medications
          </h1>
          <Link 
            href="/patient" 
            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-green-700 font-medium rounded-lg shadow transition duration-300 flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md mb-6"
            role="alert"
          >
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative p-4 w-20 h-20">
              <div className="absolute border-4 border-gray-200 w-16 h-16 rounded-full"></div>
              <div className="absolute border-t-4 border-green-600 w-16 h-16 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 text-lg">Loading your medications...</p>
          </div>
        )}

        {!loading && !error && prescriptions.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-8 text-center"
          >
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Medications Found</h2>
            <p className="text-gray-600">You don't have any active prescriptions. Please consult with your doctor.</p>
          </motion.div>
        )}

        {!loading && !error && prescriptions.length > 0 && (
          <>
            {/* Prescription Tabs */}
            {prescriptions.length > 1 && (
              <div className="mb-6 overflow-x-auto">
                <div className="flex space-x-2 border-b border-gray-200 pb-2">
                  {prescriptions.map((prescription) => (
                    <button
                      key={prescription.id}
                      onClick={() => setActivePrescription(prescription.id)}
                      className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                        activePrescription === prescription.id
                          ? "bg-green-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Prescription {getPrescriptionDisplayNumber(prescription.id).toString().padStart(2, '0')} 
                      <span className="ml-2 text-xs opacity-80">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => setActivePrescription(null)}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      activePrescription === null
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    View All
                  </button>
                </div>
              </div>
            )}

            {/* Active Prescription Info Card */}
            {activePrescription && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-green-500"
              >
                {(() => {
                  const prescription = prescriptions.find(p => p.id === activePrescription);
                  if (!prescription) return null;
                  
                  return (
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-xl font-bold text-gray-800">Prescription #{getPrescriptionDisplayNumber(prescription.id)}</h2>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 mb-2">
                          <span className="font-medium">Date:</span>{" "}
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </p>
                        
                        {prescription.Tests && (
                          <p className="text-gray-700 mb-2">
                            <span className="font-medium">Tests:</span>{" "}
                            {prescription.Tests}
                          </p>
                        )}
                        
                        {prescription.Operations && (
                          <p className="text-gray-700 mb-2">
                            <span className="font-medium">Operations:</span>{" "}
                            {prescription.Operations}
                          </p>
                        )}
                        
                        {prescription.ExtraInstructions && (
                          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <p className="font-medium text-amber-800 mb-1">Doctor's Instructions:</p>
                            <p className="text-amber-900">{prescription.ExtraInstructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Medications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredMedications.map((med, index) => (
                  <motion.div
                    key={med.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{med.name}</h3>
                        {med.prescriptionId !== activePrescription && activePrescription !== null && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            Rx #{getPrescriptionDisplayNumber(med.prescriptionId)}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Take</p>
                            <p className="font-semibold text-gray-900">{med.time}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-semibold text-gray-900">{med.days} days</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Stock Remaining</span>
                          <span className={`text-sm font-medium ${
                            med.stock / med.total > 0.3 ? "text-green-700" : "text-red-700"
                          }`}>
                            {med.stock} / {med.total}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(med.stock / med.total) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              med.stock / med.total > 0.6 
                                ? "bg-green-500" 
                                : med.stock / med.total > 0.3 
                                  ? "bg-yellow-500" 
                                  : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                      
                      {med.stock / med.total < 0.3 && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-100 mb-4">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-sm font-medium text-red-800">Running low on medication!</p>
                          </div>
                        </div>
                      )}
                      
                      <button 
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium rounded-lg shadow transition duration-300 flex items-center justify-center"
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Request Refill
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicationStatus;
