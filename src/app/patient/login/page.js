"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = "/api/auth/patient-login";

export default function PatientLogin() {
  const router = useRouter();
  const [patient, setPatient] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/patient"); // Using router instead of window.location
        }, 2000);
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="title">Health Nexus: Your Health, Our Mission</h1>
        <p className="subtitle">
          Don't let financial constraints stop you from getting the medical help
          you deserve. Health Nexus connects you with NGOs and pharmaceutical
          companies to ensure you receive the necessary treatments and
          medications.
        </p>
      </div>

      <div className="login-card">
        <div className="login-header">
          <Image
            src="/images/patient.png"
            width={120}
            height={120}
            alt="Patient Logo"
            className="rounded-lg"
            loading="lazy"
          />
          <h2>Patient Login</h2>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={patient.email}
              onChange={handleChange}
              placeholder="E-mail address"
              required
            />
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={patient.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          

          <button type="submit" className="login-btn">
            Log in
          </button>

          <p className="signup-text" style={{marginTop: "10px"}}>Don't have an account?</p>
          <button
            type="button"
            className="signup-btn"
            onClick={() => {
              router.push("/patient/signup");
            }}
          >
            Create New Account
          </button>
        </form>
      </div>
    </div>
  );
}
