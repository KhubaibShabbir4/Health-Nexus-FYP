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

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/DocLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        router.push("/doc_landing"); // Redirect to Doctor's dashboard
      } else {
        setErrorMessage(data.error || "Invalid email or password.");
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
        <div className="login-box bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/doclogin.jpeg"
              width={120}
              height={120}
              alt="Doctor Login"
              className="rounded-lg"
              loading="lazy"
            />
          </div>

          <h2 className="text-center text-2xl font-bold mb-6 text-green-700">
            Doctor Login
          </h2>

          <form onSubmit={handleLogin}>
            <div className="input-group mb-4">
              <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="E-mail address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>

            <div className="input-group mb-4">
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-black"
              />
            </div>

            {errorMessage && <p className="text-sm text-red-500 mb-4">{errorMessage}</p>}

            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Log in
            </button>
          </form>

          <div className="flex justify-between items-center mt-4">
            <label className="text-sm text-black">
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
