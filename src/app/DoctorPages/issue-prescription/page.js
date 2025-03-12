"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorHeader from "../../components/Header/page";
import Footer from "../../components/footer/page";

const IssuePrescriptionPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    Medicines: "",
    Tests: "",
    Operations: "",
    ExtraInstructions: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        // Get appointment_id from URL query params
        const params = new URLSearchParams(window.location.search);
        const appointmentId = params.get("appointment_id");
        
        if (!appointmentId) {
          setErrorMessage("Appointment ID is missing");
          return;
        }

        // Fetch appointment details
        const response = await fetch(`/api/auth/get-appointment?id=${appointmentId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointment details");
        }

        const data = await response.json();
        setAppointment(data);

        // Check if prescription already exists for this appointment
        if (data.prescriptions && data.prescriptions.length > 0) {
          const existingPrescription = data.prescriptions[0];
          // Pre-fill form with existing prescription data
          setFormData({
            Medicines: existingPrescription.Medicines || "",
            Tests: existingPrescription.Tests || "",
            Operations: existingPrescription.Operations || "",
            ExtraInstructions: existingPrescription.ExtraInstructions || "",
          });
          setSuccessMessage("This appointment already has a prescription. You can update it below.");
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setErrorMessage("Failed to load appointment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Check each field for empty values
    if (!formData.Medicines.trim()) {
      errors.Medicines = "Medicines are required";
    }
    
    if (!formData.Tests.trim()) {
      errors.Tests = "Tests are required";
    }
    
    if (!formData.Operations.trim()) {
      errors.Operations = "Operations/Procedures are required";
    }
    
    if (!formData.ExtraInstructions.trim()) {
      errors.ExtraInstructions = "Extra instructions are required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`).scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      return;
    }
    
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const params = new URLSearchParams(window.location.search);
      const appointmentId = params.get("appointment_id");

      if (!appointmentId) {
        setErrorMessage("Appointment ID is missing");
        return;
      }

      const response = await fetch("/api/auth/issuePrescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointment_id: appointmentId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to issue prescription");
      }

      setSuccessMessage("Prescription issued successfully!");
      
      // Redirect back to appointments page after a short delay
      setTimeout(() => {
        router.push(`/DoctorPages/appointment_history?id=${appointment?.doctor_id}`);
      }, 2000);
    } catch (error) {
      console.error("Error issuing prescription:", error);
      setErrorMessage("Failed to issue prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DoctorHeader />
      
      {loading && (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center">
          <div className="relative p-4 w-48 h-48 flex justify-center items-center">
            <div className="absolute border-4 border-gray-200 w-36 h-36 rounded-full"></div>
            <div className="absolute border-t-4 border-blue-500 w-36 h-36 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      
      <div className="flex-1 p-6 pb-40 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
            Issue Prescription
          </h1>
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          
          {appointment && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Appointment Details</h2>
              <p><span className="font-medium">Patient:</span> {appointment.name}</p>
              <p><span className="font-medium">Date:</span> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {appointment.time}</p>
              <p><span className="font-medium">Status:</span> {appointment.status}</p>
              {appointment.reason && (
                <p><span className="font-medium">Reason:</span> {appointment.reason}</p>
              )}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medicines <span className="text-red-500">*</span>
              </label>
              <textarea
                name="Medicines"
                value={formData.Medicines}
                onChange={handleChange}
                rows={4}
                required
                className={`w-full border ${formErrors.Medicines ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter prescribed medicines and dosage"
              />
              {formErrors.Medicines && (
                <p className="mt-1 text-sm text-red-500">{formErrors.Medicines}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tests <span className="text-red-500">*</span>
              </label>
              <textarea
                name="Tests"
                value={formData.Tests}
                onChange={handleChange}
                rows={3}
                required
                className={`w-full border ${formErrors.Tests ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter recommended tests"
              />
              {formErrors.Tests && (
                <p className="mt-1 text-sm text-red-500">{formErrors.Tests}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operations/Procedures <span className="text-red-500">*</span>
              </label>
              <textarea
                name="Operations"
                value={formData.Operations}
                onChange={handleChange}
                rows={3}
                required
                className={`w-full border ${formErrors.Operations ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter recommended operations or procedures"
              />
              {formErrors.Operations && (
                <p className="mt-1 text-sm text-red-500">{formErrors.Operations}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                name="ExtraInstructions"
                value={formData.ExtraInstructions}
                onChange={handleChange}
                rows={4}
                required
                className={`w-full border ${formErrors.ExtraInstructions ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter additional instructions or notes"
              />
              {formErrors.ExtraInstructions && (
                <p className="mt-1 text-sm text-red-500">{formErrors.ExtraInstructions}</p>
              )}
            </div>
            
            <div className="flex justify-center pt-6 pb-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
              >
                {loading ? "Saving..." : "Issue Prescription"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="relative w-full">
        <Footer />
      </div>
    </div>
  );
};

export default IssuePrescriptionPage; 