"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "../../components/Header/page";
import Footer from "../../components/footer/page";

const BookAppointmentPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [doctor_id, setDoctor_id] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  const getDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/get-doctors", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      } else {
        router.push("/patient/login");
      }
    } catch (error) {
      router.push("/patient/login");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/getUser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setId(data.patient.patient_id);
        setName("");
        setDate("");
        setDoctor_id("");
      } else {
        router.push("/patient/login");
      }
    } catch (error) {
      router.push("/patient/login");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
    getDoctors();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!doctor_id) {
      newErrors.doctor_id = "Please select a doctor";
    }
    
    if (!date) {
      newErrors.date = "Date is required";
    } else {
      // Check if the selected date is in the past
      const selectedDate = new Date(date);
      const currentDate = new Date();
      
      // Reset hours, minutes, seconds, and milliseconds for accurate date comparison
      currentDate.setHours(0, 0, 0, 0);
      
      if (selectedDate < currentDate) {
        newErrors.date = "Appointment date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/auth/book-appointment", {
        user_id: id,
        appointmentId: 0,
        name,
        date,
        doctor_id,
      });
      console.log("Appointment booked:", response.data);
      setShowSuccessModal(true);
      // Reset form
      setName("");
      setDate("");
      setDoctor_id("");
      // Redirect to patient page after a short delay
      setTimeout(() => {
        router.push("/patient");
      }, 2000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div 
        className="min-h-screen w-full flex items-center justify-center p-4 relative pt-24"
        style={{
          backgroundImage: "url('/images/doctorappo.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/80 to-blue-300/80"></div>
        {loading && (
          <div className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center">
            <div className="relative p-4 w-48 h-48 flex justify-center items-center">
              <div className="absolute border-4 border-gray-200 w-36 h-36 rounded-full"></div>
              <div className="absolute border-t-4 border-blue-500 w-36 h-36 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4 transform transition-all">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Appointment Booked Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your appointment has been confirmed. We look forward to seeing you!
                </p>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 relative z-10 border border-white/20">
          <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
            Book Appointment
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full border-2 rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 transition-all ${
                  errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors({ ...errors, name: null });
                  }
                }}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Doctor Select */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Doctor: <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border-2 rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 transition-all ${
                  errors.doctor_id ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                value={doctor_id}
                onChange={(e) => {
                  setDoctor_id(e.target.value);
                  if (errors.doctor_id) {
                    setErrors({ ...errors, doctor_id: null });
                  }
                }}
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.firstName} {doctor.lastName} ({doctor.specialization})
                  </option>
                ))}
              </select>
              {errors.doctor_id && (
                <p className="mt-1 text-sm text-red-500">{errors.doctor_id}</p>
              )}
            </div>

            {/* Date Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date: <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={`w-full border-2 rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 transition-all ${
                  errors.date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                value={date}
                min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) {
                    setErrors({ ...errors, date: null });
                  }
                }}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform hover:scale-105"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookAppointmentPage;