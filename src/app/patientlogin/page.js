"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

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
        router.push("/patient");
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
        <title>Patient Login</title>
      </Head>

      <div className="flex flex-row justify-center items-center flex-grow pt-10 pb-10 px-6 md:px-20">
        {/* Motivational Section */}
        <div className="hidden md:flex flex-col justify-center w-1/2 pr-10">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Health Nexus: Your Health, Our Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Don't let financial constraints stop you from getting the medical help you deserve. 
            Health Nexus connects you with NGOs and pharmaceutical companies to ensure you receive
            the necessary treatments and medications. Your well-being matters, and we are here to help!
          </p>
        </div>

        {/* Login Form Container */}
        <div className="login-box bg-white p-8 rounded-lg shadow-lg w-full max-w-sm md:w-1/2">
          <div className="flex justify-center mb-6">
            <Image src="/images/patient.png" width={120} height={120} alt="Pharmacy Logo" className="rounded-lg" loading="lazy" />
          </div>

          <h2 className="text-center text-2xl font-bold mb-6 text-green-700">Login</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">E-mail address</label>
              <input
                type="email"
                id="email"
                placeholder="E-mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
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

            {errorMessage && <p className="text-sm text-red-500 mb-4">{errorMessage}</p>}

            <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
              Log in
            </button>
          </form>

          <div className="flex justify-between items-center mt-4">
  <label className="flex items-center text-sm text-black">
    <input type="checkbox" className="mr-2" /> Remember Me
  </label>
  <a href="#" className="text-sm text-blue-500 hover:underline">Forgot your password?</a>
</div>


          <div className="text-center mt-6">
            <p className="text-sm text-gray-700">Don't have an account?</p>
            <button onClick={() => router.push("/patientsignup")} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200">
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
