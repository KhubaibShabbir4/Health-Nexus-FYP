"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MedicationStatus = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState("");
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
          setLoading(false);
          if (!data || data.length === 0) {
            console.log("No prescriptions found for this user");
            return;
          }
          setPrescriptions(data);
          try {
            const meds = JSON.parse(data[0].Medicines);
            console.log("Parsed medicines:", meds);
            const updatedMedications = meds.map((med, index) => {
              const times = med.time.split(",").length;
              const total = times * parseInt(med.days);
              const createdAt = new Date(data[0].createdAt);
              const now = new Date();
              const diffDays = Math.floor(
                (now - createdAt) / (1000 * 60 * 60 * 24)
              );
              const stock = total - diffDays * times;
              return { ...med, total, stock, id: index };
            });
            setMedications(updatedMedications);
          } catch (error) {
            console.error("Error parsing medicines:", error);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching prescriptions:", error);
          setError("Error loading prescriptions. Please try again later.");
        });
    } else {
      console.log("No id available to fetch prescriptions");
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

  const copyPrescriptionToClipboard = () => {
    if (medications.length === 0 || !prescriptions.length) return;
    
    const prescription = prescriptions[0];
    const date = new Date(prescription.createdAt).toLocaleDateString();
    
    let text = `MEDICATION DETAILS (Prescribed on ${date})\n\n`;
    
    medications.forEach((med, index) => {
      text += `${index + 1}. ${med.name}\n`;
      text += `   - Take: ${med.time}\n`;
      text += `   - Duration: ${med.days} days\n`;
      text += `   - Remaining: ${med.stock} doses\n\n`;
    });
    
    if (prescription.Tests) {
      text += `TESTS: ${prescription.Tests}\n\n`;
    }
    
    if (prescription.Operations) {
      text += `OPERATIONS: ${prescription.Operations}\n\n`;
    }
    
    if (prescription.ExtraInstructions) {
      text += `INSTRUCTIONS: ${prescription.ExtraInstructions}\n`;
    }
    
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  return (
    <div className="w-full min-h-screen bg-white pb-12">
      <div className="p-4 sm:p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700">
            💊 My Medications
          </h2>
          <Link href="/patient" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading && !error && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <span className="ml-3 text-gray-600">Loading your medications...</span>
          </div>
        )}

        {!loading && !error && medications.length === 0 && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Note: </strong>
            <span className="block sm:inline">No medications found. Please check with your doctor.</span>
          </div>
        )}

        {medications.length > 0 && (
          <>
            <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Prescription Information</h3>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Prescribed on:</span>{" "}
                {new Date(prescriptions[0].createdAt).toLocaleDateString()}
              </p>
              {prescriptions[0].ExtraInstructions && (
                <p className="text-gray-700">
                  <span className="font-medium">Doctor's Instructions:</span>{" "}
                  {prescriptions[0].ExtraInstructions}
                </p>
              )}
              <button 
                onClick={copyPrescriptionToClipboard}
                className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                {copySuccess ? "Copied!" : "Copy Prescription Details"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-2xl transition-all"
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    {med.name}
                  </h3>
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium">Take:</span>{" "}
                    <strong>{med.time}</strong>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Duration:</span>{" "}
                    <strong>{med.days} days</strong>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Stock:</span>{" "}
                    <strong>{med.stock}</strong> / {med.total}
                  </p>

                  {/* Custom Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        med.stock / med.total > 0.3 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${(med.stock / med.total) * 100}%` }}
                    ></div>
                  </div>

                  {med.stock / med.total < 0.3 && (
                    <p className="text-red-600 font-bold mt-3">
                      ⚠️ Running Low! Refill Soon
                    </p>
                  )}

                  {/* Custom Button */}
                  <button className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition duration-300">
                    Request Refill
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicationStatus;
