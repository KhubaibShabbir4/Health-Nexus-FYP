"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./page.css";
import { ToastContainer } from "react-toastify";


const API_URL = "/api/auth/doctorSignup";

export default function DoctorSignup() {
  const router = useRouter(); // Initialize router

  const [doctor, setDoctor] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    password: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
    role: "doctor",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Name validation - only allow letters and spaces
    if (name === "firstName" || name === "lastName") {
      const sanitizedValue = value.replace(/[^A-Za-z\s]/g, '');
      if (value !== sanitizedValue) {
        setError(`${name === "firstName" ? "First" : "Last"} name can only contain alphabets and spaces`);
        setDoctor({ ...doctor, [name]: sanitizedValue });
        return;
      }
    }
  
    if (name === "dob") {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      if (value > today) {
        setError("Date of birth cannot be in the future.");
        return; // Stop updating state if an invalid date is selected
      } else {
        setError(""); // Clear error if date is valid
      }
    }
  
    // ✅ Convert email to lowercase & prevent uppercase
    if (name === "email") {
      if (/[A-Z]/.test(value)) {
        setError("Email must not contain uppercase letters.");
        return;
      } else {
        setError(""); // Clear error if email is valid
      }
    }
  
    // License number validation - exactly 16 characters
    if (name === "licenseNumber") {
      const sanitizedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      if (value !== sanitizedValue) {
        setError("License number can only contain alphanumeric characters");
        setDoctor({ ...doctor, [name]: sanitizedValue });
        return;
      }
      if (sanitizedValue.length > 16) {
        setError("License number must be exactly 16 characters");
        setDoctor({ ...doctor, [name]: sanitizedValue.slice(0, 16) });
        return;
      }
      setError("");
    }
  
    // Add password validation check
    if (name === "password") {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*]/.test(value);
      const isLengthValid = value.length >= 8;

      if (value && (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !isLengthValid)) {
        setError("Password does not meet requirements");
      } else {
        setError("");
      }
    }

    setDoctor({ ...doctor, [name]: name === "email" ? value.toLowerCase() : value });
    setSuccessMessage("");
  };
  
  

  // ✅ Input Validations
  const validateInputs = () => {
    const {
      firstName,
      lastName,
      dob,
      email,
      password,
      specialization,
      licenseNumber,
      experience,
    } = doctor;

    if (
      !firstName ||
      !lastName ||
      !dob ||
      !email ||
      !password ||
      !specialization ||
      !licenseNumber ||
      !experience
    ) {
      return "All fields are required!";
    }

    // ✅ First Name validation - only alphabets and spaces
    if (!/^[A-Za-z\s]+$/.test(firstName)) {
      return "First name can only contain alphabets and spaces.";
    }

    // ✅ Last Name validation - only alphabets and spaces
    if (!/^[A-Za-z\s]+$/.test(lastName)) {
      return "Last name can only contain alphabets and spaces.";
    }

    // ✅ Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // ✅ Ensure date of birth is in the past
    const today = new Date().toISOString().split("T")[0];
    if (dob >= today) {
      return "Date of birth must be in the past.";
    }

    // ✅ License number validation (must be exactly 16 characters)
    const licenseRegex = /^[A-Z0-9]{16}$/;
    if (!licenseRegex.test(licenseNumber)) {
      return "License number must be exactly 16 alphanumeric characters.";
    }

    // ✅ Experience should be a positive number
    if (parseInt(experience) < 1) {
      return "Years of experience must be at least 1 year.";
    }

    // Enhanced password validation
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*).";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }

    return null; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctor),
      });

      if (response.ok) {
        // Clear form data if needed
        setDoctor({
          firstName: "",
          lastName: "",
          dob: "",
          email: "",
          password: "",
          specialization: "",
          licenseNumber: "",
          experience: "",
          role: "doctor",
        });
        setSuccessMessage("Doctor registered successfully!");
        setError("");
        
        // Show success toast
        toast.success("You have been registered as doctor!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: {
            backgroundColor: '#10B981',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '16px',
          },
          transition: Bounce,
        });

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/admin/admin-dash");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to register doctor.");
      }
    } catch (error) {
      console.error("Error registering doctor:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="doctor-container">
      <ToastContainer />
      <div className="doctor-card">
        <h2 className="doctor-title">Doctor Signup</h2>
        <p className="doctor-subtitle">
          Fill in the details to register as a doctor
        </p>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="doctor-form">
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={doctor.firstName} 
              onChange={handleChange} 
              placeholder="Enter First Name (alphabets only)" 
              required 
              className={`w-full p-2 border rounded transition-colors duration-200 ${
                error && error.includes("First name") 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:border-green-500'
              }`}
              title="Please enter alphabets only"
            />
            {error && error.includes("First name") && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Note: Only alphabets and spaces are allowed
            </p>
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={doctor.lastName} 
              onChange={handleChange} 
              placeholder="Enter Last Name (alphabets only)" 
              required 
              className={`w-full p-2 border rounded transition-colors duration-200 ${
                error && error.includes("Last name") 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:border-green-500'
              }`}
              title="Please enter alphabets only"
            />
            {error && error.includes("Last name") && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Note: Only alphabets and spaces are allowed
            </p>
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={doctor.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={doctor.email} 
                            onChange={handleChange} 
                            placeholder="example@emailprovider.com" 
                            required 
                            className={`w-full p-2 border rounded transition-colors duration-200 ${
                                error && error.includes("email") 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-300 focus:border-green-500'
                            }`}
                        />
                        {error && error.includes("email") && (
                            <p className="text-red-500 text-sm mt-1">{error}</p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                            Format: example@emailprovider.com
                        </p>
                    </div>

          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={doctor.specialization}
              onChange={handleChange}
              placeholder="E.g., Cardiologist, Dentist"
              required
            />
          </div>

          <div className="form-group">
            <label>License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={doctor.licenseNumber}
              onChange={handleChange}
              placeholder="Enter 16-character license number"
              required
              maxLength="16"
              className={`w-full p-2 border rounded transition-colors duration-200 ${
                error && error.includes("License") 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 focus:border-green-500'
              }`}
              title="Please enter a 16-character alphanumeric license number"
            />
            {error && error.includes("License") && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Note: License number must be exactly 16 alphanumeric characters
            </p>
            {doctor.licenseNumber && (
              <p className="text-gray-500 text-xs mt-1">
                Characters remaining: {16 - doctor.licenseNumber.length}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={doctor.experience}
              onChange={handleChange}
              placeholder="Enter years of experience"
              required
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={doctor.password} 
                onChange={handleChange} 
                placeholder="Enter password" 
                required 
                className={`w-full p-2 border rounded transition-colors duration-200 ${
                  error && error.includes("Password") 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 focus:border-green-500'
                }`}
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {error && error.includes("Password") && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            {doctor.password && (
              (!(/[A-Z]/.test(doctor.password) && 
                 /[a-z]/.test(doctor.password) && 
                 /\d/.test(doctor.password) && 
                 /[!@#$%^&*]/.test(doctor.password) && 
                 doctor.password.length >= 8)) && (
                <div className="password-requirements mt-2">
                  <p className="text-gray-500 text-xs mb-1">Password Requirements:</p>
                  <ul className="text-xs space-y-1">
                    <li className={`${doctor.password.length >= 8 ? 'text-green-500' : 'text-gray-500'}`}>
                      • At least 8 characters long
                    </li>
                    <li className={`${/[A-Z]/.test(doctor.password) ? 'text-green-500' : 'text-gray-500'}`}>
                      • At least one uppercase letter
                    </li>
                    <li className={`${/[a-z]/.test(doctor.password) ? 'text-green-500' : 'text-gray-500'}`}>
                      • At least one lowercase letter
                    </li>
                    <li className={`${/[!@#$%^&*]/.test(doctor.password) ? 'text-green-500' : 'text-gray-500'}`}>
                      • At least one special character (!@#$%^&*)
                    </li>
                    <li className={`${/\d/.test(doctor.password) ? 'text-green-500' : 'text-gray-500'}`}>
                      • At least one number
                    </li>
                  </ul>
                </div>
              )
            )}
          </div>

          <button type="submit" className="doctor-submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}