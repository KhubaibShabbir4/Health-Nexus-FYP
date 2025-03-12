"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./page.css";
import Footer from "../../components/footer/page";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header/page";
import "react-phone-input-2/lib/style.css";
import PhoneNumberInput from "../../components/PhoneNumberInput/page";

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
      } else {
        setSession(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSession(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    session,
    loading,
    logout,
  };
}

export default function Signup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    cnic: "",
    cnicExpiry: "",
    address: "",
    city: "",
    province: "",
    country: "",
    medicalCondition: "",
    currentMedications: "",
    allergies: "",
    prescriptionFile: null,
    healthReports: null,
    financialSupport: "",
    monthlyIncome: "",
    occupation: "",
    dependents: "",
    financialProof: null,
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    preferredNGO: "",
    preferredCity: "",
    password: "",
    confirmPassword: "",
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  const [fileLabels, setFileLabels] = useState({
    prescriptionFile: "Upload the medical report (if any)",
    financialProof: "Upload the electricity Bill",
    salarySlip: "Upload the salary slip"
  });

  // Auto-refresh effect - will refresh the page only once when it's opened
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if the URL already has the refreshed parameter
      const urlParams = new URLSearchParams(window.location.search);
      const hasRefreshed = urlParams.get('refreshed');
      
      if (!hasRefreshed) {
        // Add the refreshed parameter to the URL
        urlParams.set('refreshed', 'true');
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.location.href = newUrl;
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for name fields (letters and spaces only)
    if (name === 'fullName' || name === 'occupation' || name === 'emergencyContactName') {
      const nameRegex = /^[A-Za-z\s]*$/;
      if (!nameRegex.test(value)) return;
    }

    // Example validations (same as before)
    if (name === 'dependents') {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) return;
    }
    if (name === 'phone' || name === 'emergencyContactPhone') {
      const phoneRegex = /^[0-9-]*$/;
      if (!phoneRegex.test(value)) return;
    }
    if (name === 'cnic') {
      const cnicRegex = /^[0-9-]*$/;
      if (!cnicRegex.test(value)) return;
    }
    if (name === 'dob') {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate > today) return;
    }
    if (name === 'cnicExpiry') {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate < today) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setFileLabels((prev) => ({
        ...prev,
        [name]: files[0].name,
      }));
    }
  };

  const handleFileUpload = (name) => {
    const fileInput = document.querySelector(`input[name="${name}"]`);
    fileInput.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Basic password mismatch check
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: '#ef4444',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        });
        setIsLoading(false);
        return;
      }
  
      // Step 1: Send OTP
      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
  
      if (!otpResponse.ok) {
        throw new Error("Failed to send OTP");
      }
  
      toast.success("🔐 OTP has been sent to your email!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#22c55e',
          color: 'white',
          fontSize: '16px',
          fontWeight: '500',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
      setShowOtpModal(true);
    } catch (error) {
      toast.error(error.message || "Error sending OTP", {
        style: {
          background: '#ef4444',
          color: 'white',
          fontSize: '16px',
          fontWeight: '500',
          borderRadius: '10px',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleOtpSubmit = async () => {
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "confirmPassword" && formData[key] != null) {
        if (key === "prescriptionFile" || key === "healthReports" || key === "financialProof") {
          if (formData[key]) {
            submissionData.append(key, formData[key]);
          }
        } else {
          submissionData.append(key, String(formData[key]));
        }
      }
    });

    try {
      // Step 2: Verify OTP
      const otpVerifyResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otp }),
        credentials: "include", // <-- ADDED: Sends OTP cookie in request
      });

      if (!otpVerifyResponse.ok) {
        throw new Error("Invalid OTP");
      }

      // If OTP is valid, proceed with signup
      const response = await fetch("/api/auth/patient-signup", {
        method: "POST",
        body: submissionData,
        credentials: "include", // optional if you need cookies in that route
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to sign up");
      }

      toast.success("✨ Signup successful!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#22c55e',
          color: 'white',
          fontSize: '16px',
          fontWeight: '500',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });

      router.push("/patient");
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error(error.message || "Error signing up. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#ef4444',
          color: 'white',
          fontSize: '16px',
          fontWeight: '500',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    setResendDisabled(true);
    setResendTimer(30); // 30 seconds cooldown

    try {
      const otpResponse = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
        credentials: "include", // <-- ADDED for resend as well
      });

      if (!otpResponse.ok) {
        throw new Error("Failed to send OTP");
      }

      toast.success("🔄 New OTP has been sent!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#22c55e',
          color: 'white',
          fontSize: '16px',
          fontWeight: '500',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      });

      // Start countdown timer
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Error resending OTP", {
        style: {
          background: '#ef4444',
          color: 'white',
          fontSize: '16px',
          fontWeight: '500',
          borderRadius: '10px',
        },
      });
      setResendDisabled(false);
    }
  };

  return (
    <div className="w-full bg-white py-12 flex flex-col justify-center">
      <ToastContainer />
      <div className="container mx-auto max-w-4xl">
        <Header />
        <h2 className="text-3xl font-bold text-center mb-8">Patient Signup</h2>
        <form onSubmit={handleSubmit} className="form bg-white shadow-lg rounded-lg p-8">
          {/* Personal Information */}
          <fieldset className="mb-8">
            <legend className="text-xl font-semibold mb-4">Personal Information</legend>
            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name (letters only)"
                onChange={handleChange}
                required
                pattern="[A-Za-z\s]+"
                className="w-full p-2 border rounded"
              />

              <select name="gender" onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input
                type="date"
                name="dob"
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                required
                className="w-full p-2 border rounded"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                required
                className="w-full p-2 border rounded"
              />

              <PhoneNumberInput
                value={formData.phone}
                onChange={(phone) => setFormData({ ...formData, phone })}
              />

              <input
                type="text"
                name="cnic"
                placeholder="CNIC (e.g., 12345-1234567-1)"
                onChange={handleChange}
                pattern="[0-9-]+"
                maxLength="15"
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </fieldset>

          {/* Medical History */}
          <fieldset className="mb-8">
            <legend className="text-xl font-semibold mb-4">Medical History</legend>
            <div className="space-y-4">
              <input
                type="text"
                name="medicalCondition"
                placeholder="Medical Condition"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                name="currentMedications"
                placeholder="Current Medications"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="allergies"
                placeholder="Allergies"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <div className="file-input-wrapper">
                <div className="file-input-container">
                  <label className="custom-file-label">
                    <input
                      type="file"
                      name="prescriptionFile"
                      onChange={handleFileChange}
                      className="custom-file-input"
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                    />
                    <span className="file-label-text">{fileLabels.prescriptionFile}</span>
                  </label>
                  <button type="button" className="upload-btn" onClick={() => handleFileUpload('prescriptionFile')}>Upload</button>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Financial Information */}
          <fieldset className="mb-8">
            <legend className="text-xl font-semibold mb-4">Financial Information</legend>
            <div className="space-y-4">
              <select name="financialSupport" onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Need Financial Support?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <select name="monthlyIncome" onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Select Monthly Income</option>
                <option value="< 20,000">Less than 20,000</option>
                <option value="20,000 - 50,000">20,000 - 50,000</option>
                <option value="> 50,000">More than 50,000</option>
              </select>
              <input
                type="text"
                name="occupation"
                placeholder="Occupation (letters only)"
                onChange={handleChange}
                required
                pattern="[A-Za-z\s]+"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="dependents"
                placeholder="Number of Dependents"
                onChange={handleChange}
                min="0"
                required
                className="w-full p-2 border rounded"
              />
              <div className="file-input-wrapper">
                <div className="file-input-container">
                  <label className="custom-file-label">
                    <input
                      type="file"
                      name="financialProof"
                      onChange={handleFileChange}
                      className="custom-file-input"
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                    />
                    <span className="file-label-text">{fileLabels.financialProof}</span>
                  </label>
                  <button type="button" className="upload-btn" onClick={() => handleFileUpload('financialProof')}>Upload</button>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Emergency Contact */}
          <fieldset className="mb-8">
            <legend className="text-xl font-semibold mb-4">Emergency Contact</legend>
            <div className="space-y-4">
              <input
                type="text"
                name="emergencyContactName"
                placeholder="Emergency Contact Name (letters only)"
                onChange={handleChange}
                required
                pattern="[A-Za-z\s]+"
                className="w-full p-2 border rounded"
              />
              <select
                name="emergencyContactRelation"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select Relationship</option>
                <option value="Parent">Parent</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Other">Other</option>
              </select>
              <PhoneNumberInput
                value={formData.emergencyContactPhone}
                onChange={(phone) => setFormData({ ...formData, emergencyContactPhone: phone })}
              />
            </div>
          </fieldset>

          {/* Account Security */}
          <fieldset className="mb-8">
            <legend className="text-xl font-semibold mb-4">Account Security</legend>
            <div className="space-y-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </fieldset>

          <button
            type="submit"
            className="submitBtn relative w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Processing...</h3>
                <p className="text-gray-600">Please wait while we verify your details</p>
                <div className="flex space-x-2 items-center">
                  <div
                    className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTP Verification Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 relative">
              <div className="text-center mb-6">
                <div className="bg-green-100 w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Verify Your Email
                </h3>
                <p className="text-gray-600 mb-6">
                  We've sent a verification code to
                  <br />
                  <span className="font-semibold text-gray-800">
                    {formData.email}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 text-center text-lg font-semibold tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="Enter OTP"
                  maxLength="6"
                />

                <div className="text-center text-sm text-gray-600 mt-2">
                  Didn't receive the code?
                  <button
                    onClick={handleResendOtp}
                    disabled={resendDisabled}
                    className={`${
                      resendDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    } font-semibold ml-2 transition-colors px-4 py-2 rounded-lg`}
                  >
                    {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend"}
                  </button>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={handleOtpSubmit}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
                  >
                    Verify & Submit
                  </button>
                  <button
                    onClick={() => setShowOtpModal(false)}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
