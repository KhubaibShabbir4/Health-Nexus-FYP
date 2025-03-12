
'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";
import Image from "next/image";

const API_URL = "/api/auth/NgoLogin";

export default function NgoLogin() {
  const [ngo, setNgo] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setNgo({ ...ngo, [e.target.name]: e.target.value });
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
        body: JSON.stringify(ngo),
      });
  
      const data = await response.json();
      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        
        // ✅ Save NGO details in localStorage
        localStorage.setItem("ngoUser", JSON.stringify(data.ngo));
  
        setTimeout(() => {
          router.push("/NGOS/NGO_home");  // Redirect to NGO dashboard
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
          NGOs are the heart of community support and empowerment.
          Your tireless efforts to uplift and care for those in need make a difference every day.
          At Health Nexus, we stand with you as you create positive change and build a healthier future.
        </p>
      </div>

      <div className="login-card">
        <div className="login-header">
          <Image
            src="/images/NGO.png"
            width={120}
            height={120}
            alt="NGO Logo"
            className="rounded-lg"
            loading="lazy"
          />
          <h2>NGO Login</h2>
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={ngo.email}
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
                value={ngo.password}
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

          <div className="login-options">
           
            <a href="/forgot-password" className="forgot-password">
              Forgot your password?
            </a>
          </div>

          <button type="submit" className="login-btn">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}