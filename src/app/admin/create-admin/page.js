'use client';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import "./page.css";

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
  const [showPassword, setShowPassword] = useState(false); // Toggle Password Visibility

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
    setError(""); // Clear errors when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure no fields are empty
    if (!admin.firstName || !admin.lastName || !admin.dob || !admin.email || !admin.password) {
      setError("All fields are required!");
      return;
    }

    console.log("Admin Created:", admin);
    alert("Admin successfully created!");
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2 className="admin-title">Create Admin</h2>
        <p className="admin-subtitle">Fill in the details to add a new admin</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              name="firstName" 
              value={admin.firstName} 
              onChange={handleChange} 
              placeholder="Enter first name" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              name="lastName" 
              value={admin.lastName} 
              onChange={handleChange} 
              placeholder="Enter last name" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              name="dob" 
              value={admin.dob} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={admin.email} 
              onChange={handleChange} 
              placeholder="Enter admin email" 
              required 
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={admin.password} 
                onChange={handleChange} 
                placeholder="Enter password" 
                required 
              />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="admin-submit">Create Admin</button>
        </form>
      </div>
    </div>
  );
}
