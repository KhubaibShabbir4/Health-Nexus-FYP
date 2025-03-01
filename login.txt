"use client";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Head>
        <title>Doctor Login</title>
      </Head>

      <div className="login-box bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        {/* Logo Container */}
        <div className="flex justify-center mb-6">
          <Link href="/al-khidmat">
            <Image
              src="/images/al-khidmat.png"
              width={120}
              height={120}
              alt="Pharmacy Logo"
              className="rounded-lg"
              loading="lazy"
              style={{ cursor: "pointer" }}
            />
          </Link>
        </div>

        {/* Login Form */}
        <h2 className="text-center text-2xl font-bold mb-6 text-green-700">
          Log in
        </h2>
        <form>
          {/* Email Input */}
          <div className="input-group mb-4">
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              E-mail address
            </label>
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

          {/* Password Input */}
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            />
          </div>

          {/* Options (Remember me and Forgot password) */}
          <div className="flex justify-between items-center mb-6">
            <label className="text-sm">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot your password?
            </a>
          </div>

          {/* Login Button with Link Navigation */}
          <Link href="/PharmaHome">
            <button
              type="button"
              className="w-full py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-200"
            >
              Log in
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
