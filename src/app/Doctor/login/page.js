"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL = "/api/auth/doc-login";

export default function DoctorLogin() {
  const router = useRouter();
  const [doctor, setDoctor] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
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
        body: JSON.stringify(doctor),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/DoctorPages/doc_landing");
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
        <h1 className="title">Health Nexus: Empowering Medical Professionals</h1>
        <p className="subtitle">
          Join Health Nexus to connect with patients, NGOs, and pharmaceutical 
          companies to make healthcare more accessible.
        </p>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <Image
              src="/images/doclogin.jpeg"
              width={120}
              height={120}
              alt="Doctor Logo"
              className="rounded-lg"
              loading="lazy"
            />
          </div>
          <h2>Doctor Login</h2>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={doctor.email}
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
                value={doctor.password}
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
        </form>
      </div>
    </div>
  );
}
