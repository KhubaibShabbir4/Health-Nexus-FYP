"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const router = useRouter();

  // Handle login with email and password
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setErrorMessage(""); // Clear any existing error messages

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to PharmaHome on successful login
        router.push("/Pharma/Home");
      } else {
        setErrorMessage(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>Doctor Login</title>
      </Head>

      <div className="flex justify-center items-center flex-grow pt-10 pb-10">
        {/* Login Form Container */}
        <div className="login-box bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          {/* Logo Section */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/pharm.png"
              width={120}
              height={120}
              alt="Pharmacy Logo"
              className="rounded-lg"
              loading="lazy"
            />
          </div>

          <h2 className="text-center text-2xl font-bold mb-6 text-green-700">
            Login
          </h2>

          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="input-group mb-4">
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-gray-700"
              >
                E-mail address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>

            {/* Password Input */}
            <div className="input-group mb-4">
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>

            {/* Display error message if login fails */}
            {errorMessage && (
              <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Log in
            </button>
          </form>

          {/* Options (Remember Me and Forgot Password) */}
          <div className="flex justify-between items-center mt-4">
            <label className="text-sm text-black"></label>
          </div>
        </div>
      </div>
    </div>
  );
}
