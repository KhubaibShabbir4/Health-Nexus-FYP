'use client';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";

const API_URL = "/api/auth/createAdmin"; // ✅ API Route for storing Admin data

export default function CreateAdmin() {
  const [admin, setAdmin] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    password: "",
    role: "admin",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
    setError("");
    setSuccessMessage("");
  };

  // ✅ Input Validations
  const validateInputs = () => {
    const { firstName, lastName, dob, email, password } = admin;

    if (!firstName || !lastName || !dob || !email || !password) {
      return "All fields are required!";
    }

    // ✅ Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    // ✅ Ensure password has a minimum length
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    // ✅ Ensure date of birth is in the past
    const today = new Date().toISOString().split("T")[0];
    if (dob >= today) {
      return "Date of birth must be in the past.";
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
        body: JSON.stringify(admin),
      });

      if (response.ok) {
        setAdmin({ firstName: "", lastName: "", dob: "", email: "", password: "", role: "admin" });
        setSuccessMessage("Admin successfully created!");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create admin.");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2 className="admin-title">Create Admin</h2>
        <p className="admin-subtitle">Fill in the details to add a new admin</p>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" value={admin.firstName} onChange={handleChange} placeholder="Enter first name" required />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" value={admin.lastName} onChange={handleChange} placeholder="Enter last name" required />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" value={admin.dob} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={admin.email} onChange={handleChange} placeholder="Enter admin email" required />
          </div>

          {/* Password Field with Eye Icon */}
          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input type={showPassword ? "text" : "password"} name="password" value={admin.password} onChange={handleChange} placeholder="Enter password" required />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="admin-submit">Create Admin</button>

          {/* ✅ "Already have an account?" - Navigate to Admin Login Page */}
          <p className="login-text">
            Already have an account?{" "}
            <span className="login-link" onClick={() => window.location.href = "/admin/AdminLogin"}>
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
