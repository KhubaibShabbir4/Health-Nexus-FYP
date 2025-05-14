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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const sessionResponse = await fetch('/api/auth/getPatientSession');

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          if (sessionData && sessionData.patient_id) {
            setId(Number(sessionData.patient_id));
            return;
          }
        } else {
          const userResponse = await fetch("/api/auth/getUser");
          if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData && userData.patient && userData.patient.patient_id) {
              setId(Number(userData.patient.patient_id));
              return;
            }
          } else {
            const localPatientId = localStorage.getItem('patientId');
            if (localPatientId) {
              setId(Number(localPatientId));
              return;
            }

            const params = new URLSearchParams(window.location.search);
            const user_id = params.get("id");

            if (user_id) {
              setId(Number(user_id));
              return;
            }

            setError("Unable to identify patient. Please log in again.");
            setTimeout(() => {
              router.push("/patient/login");
            }, 3000);
          }
        }
      } catch (err) {
        setError("Error loading patient information. Please try again later.");
      }
    };

    fetchPatientId();
  }, [router]);

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
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setPrescriptions(data);

          return fetch(`/api/auth/Medications?user_id=${id}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(medicationsData => {
              if (medicationsData && medicationsData.length > 0) {
                let allMedications = [];
                medicationsData.forEach(prescription => {
                  try {
                    const meds = JSON.parse(prescription.Medicines);

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
                allMedications.sort((a, b) => b.prescriptionDate - a.prescriptionDate);
                setMedications(allMedications);
              }
            });
        })
        .catch((error) => {
          setLoading(false);
          setError("Error loading medications. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      // Fetch notifications for this patient
      fetch(`/api/auth/getNotifications?patientId=${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Received notifications:", data);
          setNotifications(data || []);
        })
        .catch(error => {
          console.error("Error fetching notifications:", error);
        });
    }
  }, [id]);

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/auth/markNotificationRead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: notificationId }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

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

  const getPrescriptionDisplayNumber = (realId) => {
    if (!prescriptions || prescriptions.length === 0) return 1;

    const sortedPrescriptions = [...prescriptions].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const index = sortedPrescriptions.findIndex(p => p.id === realId);
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
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-white hover:bg-gray-50 text-green-700 rounded-full shadow transition duration-300 relative"
                aria-label="Notifications"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-3 bg-green-50 border-b border-green-100">
                    <h3 className="font-bold text-green-800">Medication Notifications</h3>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 ${notification.isRead ? 'bg-white' : 'bg-green-50'} hover:bg-gray-50`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              {/* Since model has notification_content */}
                              <p className="font-medium text-gray-800">Notification</p>
                              <p className="text-sm text-gray-600">{notification.notification_content}</p>
                              {/* Only show date if available */}
                              {notification.createdAt && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              )}
                            </div>
                            {!notification.isRead && (
                              <button
  onClick={() => markNotificationAsRead(notification.id)}
  className="inline-block px-4 py-2 text-sm font-semibold text-white rounded-lg
             bg-gradient-to-r from-green-500 to-teal-500
             shadow-md hover:from-green-600 hover:to-teal-600
             focus:outline-none focus:ring-2 focus:ring-green-400
             transition-transform transition-colors duration-300
             hover:scale-105"
>
  Mark as Read
</button>


                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/patient"
              className="px-5 py-2.5 bg-white hover:bg-gray-50 text-green-700 font-medium rounded-lg shadow transition duration-300 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>
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
                      </div>

                      {/* Medication Status */}
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

                      {/* Pharmacy notification banner */}
                      {/* Removed logic that checks medicationId from notifications as model doesn't have it */}

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
