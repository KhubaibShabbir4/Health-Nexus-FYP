"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SubmitMedicationGigs = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [id, setId] = useState(0);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePrescription, setActivePrescription] = useState(null);
  const [gigRequests, setGigRequests] = useState({});
  const [submittingGig, setSubmittingGig] = useState(null);
  const [submittedGigs, setSubmittedGigs] = useState({});
  const router = useRouter();

  // Function to calculate total amount
  const calculateTotal = (medId) => {
    const quantity = parseFloat(gigRequests[medId]?.quantity || 0);
    const price = parseFloat(gigRequests[medId]?.price || 0);
    return (quantity * price).toFixed(2);
  };

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
            
            // Also get patient info if we have the ID
            try {
              const patientResponse = await fetch(`/api/auth/getPatientDetails?id=${sessionData.patient_id}`);
              if (patientResponse.ok) {
                const patientData = await patientResponse.json();
                setPatientInfo(patientData.patient);
              }
            } catch (error) {
              console.error("Error fetching patient details from session ID:", error);
            }
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
              setPatientInfo(userData.patient);
              return;
            }
          } else {
            // Check localStorage for patient ID
            const localPatientId = localStorage.getItem('patientId');
            if (localPatientId) {
              console.log("Retrieved patient_id from localStorage:", localPatientId);
              setId(Number(localPatientId));
              
              // Try to get patient details separately
              try {
                const patientResponse = await fetch(`/api/auth/getPatientDetails?id=${localPatientId}`);
                if (patientResponse.ok) {
                  const patientData = await patientResponse.json();
                  setPatientInfo(patientData.patient);
                }
              } catch (error) {
                console.error("Error fetching patient details:", error);
              }
              return;
            }
            
            // If localStorage fails, try URL parameter
            const params = new URLSearchParams(window.location.search);
            const user_id = params.get("id");
            console.log("Fallback: Received user_id from URL:", user_id);
            
            if (user_id) {
              setId(Number(user_id));
              
              // Try to get patient details separately
              try {
                const patientResponse = await fetch(`/api/auth/getPatientDetails?id=${user_id}`);
                if (patientResponse.ok) {
                  const patientData = await patientResponse.json();
                  setPatientInfo(patientData.patient);
                }
              } catch (error) {
                console.error("Error fetching patient details:", error);
              }
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
                        prescriptionDate: createdAt,
                        patientName: patientInfo?.full_name || prescription.patientName || "Patient",
                        patientId: patientInfo?.patient_id || prescription.patientId || id
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
  }, [id, patientInfo]);

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

  const handleGigInputChange = (medId, field, value) => {
    setGigRequests(prev => {
      // Convert to number if field is quantity or price
      let processedValue = value;
      if (field === 'quantity' || field === 'price') {
        processedValue = value === '' ? '' : parseFloat(value);
      }
      
      return {
        ...prev,
        [medId]: {
          ...prev[medId],
          [field]: processedValue
        }
      };
    });
  };

  // Fetch existing gigs when medications are loaded
  useEffect(() => {
    const fetchExistingGigs = async () => {
      if (id && medications.length > 0) {
        try {
          const response = await fetch(`/api/auth/getPharmacistGigs?pharmacistId=${id}`);
          if (response.ok) {
            const gigsData = await response.json();
            
            // Create a map of submitted gigs using medication IDs as keys
            const gigsMap = {};
            gigsData.forEach(gig => {
              gigsMap[gig.medicationId] = gig;
            });
            
            setSubmittedGigs(gigsMap);
          }
        } catch (error) {
          console.error("Error fetching existing gigs:", error);
        }
      }
    };
    
    fetchExistingGigs();
  }, [id, medications]);

  const submitGig = async (medId) => {
    try {
      // Validate required fields
      const requiredFields = ['quantity', 'price', 'availability'];
      const missingFields = requiredFields.filter(field => !gigRequests[medId]?.[field]);
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      setSubmittingGig(medId);
      const medication = medications.find(med => med.id === medId);
      const requestData = {
        ...gigRequests[medId],
        medicationId: medId,
        medicationName: medication.name,
        pharmacistId: id,
        prescriptionId: medication.prescriptionId,
        quantity: gigRequests[medId]?.quantity || medication.stock,
        price: parseFloat(calculateTotal(medId)),
        status: 'available',
        createdAt: new Date().toISOString(),
        totalAmount: calculateTotal(medId),
        patientId: medication.patientId,
        patientName: medication.patientName
      };
      
      // Make the actual API call to save the gig
      const response = await fetch('/api/auth/saveGig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Add to submitted gigs map
      setSubmittedGigs(prev => ({
        ...prev,
        [medId]: {
          ...requestData,
          id: result.id || Date.now()
        }
      }));
      
      // Success notification
      alert(`Gig request for ${medication.name} submitted successfully!`);
      
      // Clear form data for this medication
      setGigRequests(prev => {
        const newState = {...prev};
        delete newState[medId];
        return newState;
      });
    } catch (error) {
      console.error("Error submitting gig request:", error);
      alert("Failed to submit gig request. Please try again.");
    } finally {
      setSubmittingGig(null);
    }
  };

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)), url("/images/medsta.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-6xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white shadow-lg rounded-xl p-6"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-green-700 sm:text-4xl mb-2">
              Submit Medication Gigs
            </h1>
            <p className="text-gray-600">Help patients by providing medication services</p>
          </div>
          <Link 
            href="/Pharma/Home" 
            className="mt-4 sm:mt-0 px-5 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg shadow-sm transition duration-300 flex items-center space-x-2 border border-green-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </motion.div>

        {/* Instructions Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 mb-8 border-l-4 border-green-500"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">How to Submit Your Medication Gigs</h2>
          </div>
          
          {patientInfo && (
            <div className="flex items-center p-5 my-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-lg shadow-sm">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-full mr-4">
                <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-green-800 font-bold text-xl">
                  {patientInfo.full_name}
                </p>
                {patientInfo.email && (
                  <p className="text-green-700 text-sm flex items-center">
                    <svg className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {patientInfo.email}
                  </p>
                )}
              </div>
            </div>
          )}
          
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Review your medications listed below.</li>
            <li>For each medication, enter the quantity you can provide and your service details.</li>
            <li>Click "Submit Your Gig" to make your services available to patients.</li>
            <li>You'll be notified when a patient selects your gig for fulfillment.</li>
          </ol>
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
                <div className="flex space-x-2 border-b-2 border-gray-200 pb-2">
                  {prescriptions.map((prescription) => (
                    <button
                      key={prescription.id}
                      onClick={() => setActivePrescription(prescription.id)}
                      className={`px-6 py-3 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                        activePrescription === prescription.id
                          ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-50 hover:text-green-600"
                      }`}
                    >
                      <span className="flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Prescription {getPrescriptionDisplayNumber(prescription.id).toString().padStart(2, '0')} 
                        <span className="ml-2 text-xs opacity-80">
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </span>
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => setActivePrescription(null)}
                    className={`px-6 py-3 rounded-t-lg font-medium transition-colors ${
                      activePrescription === null
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <span className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      View All
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Medications List for Gig Submission */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-xl p-6"
            >
              <div className="bg-gradient-to-r from-green-600 via-green-500 to-teal-500 py-5 px-6 -mx-6 -mt-6 mb-8 rounded-t-lg flex items-center">
                <svg className="h-8 w-8 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h2 className="text-white text-2xl font-bold">Available Medications for Your Gigs</h2>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredMedications.map((med, index) => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`p-6 mb-6 bg-white border ${submittedGigs[med.id] ? 'border-green-300 bg-green-50' : 'border-gray-200'} rounded-xl shadow-md hover:shadow-lg transition-all`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        {/* Medication Info */}
                        <div className="mb-5 lg:mb-0 lg:pr-6 lg:w-3/5">
                          <div className="flex items-center mb-3">
                            <span className={`w-4 h-4 rounded-full mr-3 ${med.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                              {med.name}
                              {med.prescriptionId !== activePrescription && activePrescription === null && (
                                <span className="ml-3 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                                  Rx #{getPrescriptionDisplayNumber(med.prescriptionId)}
                                </span>
                              )}
                              {submittedGigs[med.id] && (
                                <span className="ml-3 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                  Gig Submitted
                                </span>
                              )}
                            </h3>
                          </div>
                          
                          <div className="text-sm text-gray-700 mb-3 bg-blue-50 p-2 rounded-md inline-flex items-center">
                            <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">Patient:</span> {med.patientName}
                          </div>
                          
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center text-sm bg-indigo-50 p-2 rounded-md">
                              <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <span className="block font-semibold text-indigo-700">Schedule</span>
                                {med.time}
                              </div>
                            </div>
                            <div className="flex items-center text-sm bg-purple-50 p-2 rounded-md">
                              <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <div>
                                <span className="block font-semibold text-purple-700">Duration</span>
                                {med.days} days
                              </div>
                            </div>
                            <div className="flex items-center text-sm bg-amber-50 p-2 rounded-md">
                              <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <div>
                                <span className="block font-semibold text-amber-700">Stock</span>
                                <span className={med.stock / med.total > 0.3 ? "text-green-600" : "text-red-600 font-medium"}>
                                  {med.stock} / {med.total}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Gig Submission Form or Submitted Gig Info */}
                        {submittedGigs[med.id] ? (
                          <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-lg lg:w-2/5 border border-green-200 shadow-md">
                            <h4 className="text-lg font-semibold text-green-800 mb-4 border-b border-green-100 pb-2 flex items-center">
                              <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Gig Submitted
                            </h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Quantity:</p>
                                  <p className="text-base font-bold">{submittedGigs[med.id].quantity}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Price per unit:</p>
                                  <p className="text-base font-bold">Rs {submittedGigs[med.id].price || (submittedGigs[med.id].totalAmount / submittedGigs[med.id].quantity).toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Total Amount:</p>
                                  <p className="text-base font-bold text-green-700">Rs {submittedGigs[med.id].totalAmount}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Availability:</p>
                                  <p className="text-base font-bold">{submittedGigs[med.id].availability}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-3 border-t border-green-100">
                                <button
                                  onClick={() => {
                                    // Set initial values for editing
                                    handleGigInputChange(med.id, 'quantity', submittedGigs[med.id].quantity);
                                    handleGigInputChange(med.id, 'price', submittedGigs[med.id].price || (submittedGigs[med.id].totalAmount / submittedGigs[med.id].quantity));
                                    handleGigInputChange(med.id, 'availability', submittedGigs[med.id].availability);
                                    if (submittedGigs[med.id].deliveryPreference) {
                                      handleGigInputChange(med.id, 'deliveryPreference', submittedGigs[med.id].deliveryPreference);
                                    }
                                    
                                    // Remove from submitted gigs to show the form again
                                    setSubmittedGigs(prev => {
                                      const newState = {...prev};
                                      delete newState[med.id];
                                      return newState;
                                    });
                                  }}
                                  className="w-full py-2.5 px-4 rounded-md font-medium text-sm bg-white border border-green-300 text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center justify-center"
                                >
                                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit Gig Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 rounded-lg lg:w-2/5 border border-blue-100 shadow-md">
                            <h4 className="text-lg font-semibold text-blue-800 mb-4 border-b border-blue-100 pb-2 flex items-center">
                              <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Submit Your Gig
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                  <svg className="h-4 w-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                  </svg>
                                  Quantity You Can Provide
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max={med.total}
                                  value={gigRequests[med.id]?.quantity || ''}
                                  onChange={(e) => handleGigInputChange(med.id, 'quantity', e.target.value)}
                                  placeholder={`Max ${med.total}`}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                  <svg className="h-4 w-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Your Price (per unit in Rs)
                                </label>
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-medium">
                                    Rs
                                  </span>
                                  <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={gigRequests[med.id]?.price || ''}
                                    onChange={(e) => handleGigInputChange(med.id, 'price', e.target.value)}
                                    placeholder="0.00"
                                    className="flex-1 min-w-0 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                  />
                                </div>
                                {(gigRequests[med.id]?.quantity && gigRequests[med.id]?.price) && (
                                  <div className="mt-1 text-sm bg-green-50 text-green-700 font-medium p-2 rounded border border-green-100">
                                    Total Amount: Rs {calculateTotal(med.id)}
                                  </div>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                  <svg className="h-4 w-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Service Availability
                                </label>
                                <select
                                  value={gigRequests[med.id]?.availability || ''}
                                  onChange={(e) => handleGigInputChange(med.id, 'availability', e.target.value)}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                >
                                  <option value="">Select availability</option>
                                  <option value="same-day">Same Day</option>
                                  <option value="next-day">Next Day</option>
                                  <option value="2-3-days">2-3 Days</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                  <svg className="h-4 w-4 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  Service Type
                                </label>
                                <select
                                  value={gigRequests[med.id]?.deliveryPreference || ''}
                                  onChange={(e) => handleGigInputChange(med.id, 'deliveryPreference', e.target.value)}
                                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                >
                                  <option value="">Select a service type</option>
                                  <option value="delivery">Home Delivery</option>
                                  <option value="pickup">Pharmacy Pickup</option>
                                </select>
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <button
                                onClick={() => submitGig(med.id)}
                                disabled={
                                  submittingGig === med.id || 
                                  !gigRequests[med.id]?.quantity || 
                                  !gigRequests[med.id]?.price || 
                                  !gigRequests[med.id]?.availability
                                }
                                className={`w-full py-3 px-4 rounded-md font-medium text-base focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                                  submittingGig === med.id
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : !gigRequests[med.id]?.quantity || !gigRequests[med.id]?.price || !gigRequests[med.id]?.availability
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white focus:ring-green-500 shadow-md"
                                }`}
                              >
                                {submittingGig === med.id ? (
                                  <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                  </span>
                                ) : (
                                  "Submit Your Gig"
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredMedications.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
                    <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700">No medications found for the selected prescription.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmitMedicationGigs;
