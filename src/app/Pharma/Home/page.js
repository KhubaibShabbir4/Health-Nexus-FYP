"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/footer/page";

export default function HomePharma() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        alert("Session timed out due to inactivity.");
        router.replace("/Pharma/Login"); // Redirects to login on timeout
      }, 60000); // 1 minute
    };

    const verifyUser = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.replace("/Pharma/Login"); // Redirect if session invalid
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        router.replace("/Pharma/Login");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Health Nexus - Pharma Home</title>
        <meta name="description" content="Health Nexus Pharma Module" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header Section */}
      <header className="fixed top-0 w-full bg-white shadow-lg z-10 flex justify-between items-center px-8 py-4">
        <div className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Health Nexus"
            width={80}
            height={80}
            className="cursor-pointer"
          />
          <h1 className="text-2xl font-bold text-green-600 ml-4">
            Health Nexus
          </h1>
        </div>
        <nav className="flex gap-4">
          <a href="/about" className="text-green-600 font-semibold">
            About
          </a>
          <a href="/" className="text-green-600 font-semibold">
            Home
          </a>
          <a href="/contact" className="text-green-600 font-semibold">
            Contact
          </a>
          <a href="/how-it-works" className="text-green-600 font-semibold">
            How it Works
          </a>
        </nav>
      </header>

      {/* Main Section */}
      <main className="flex-grow pt-32 text-center bg-gray-50">
        <h2 className="text-4xl font-bold animate-fade-in">
          Welcome {user?.email || "Pharma Partner"}!
        </h2>

        {/* NGOs on Board Section */}
        <h3 className="text-3xl font-bold mt-8 mb-6 text-green-700">
          NGOs on Board
        </h3>

        <div className="flex flex-wrap justify-center gap-8">
          {[
            {
              href: "/NGO/akhuwat",
              src: "/images/akhuwat.png",
              alt: "Akhuwat",
            },
            {
              href: "/NGO/Saylani",
              src: "/images/saylani.png",
              alt: "Saylani",
            },
            { href: "/NGO/JDC", src: "/images/JDC.png", alt: "JDC Foundation" },
            { href: "/NGO/MAA", src: "/images/MAA.jpg", alt: "MAA" },
            {
              href: "/NGO/edhi",
              src: "/images/edhi-foundation.png",
              alt: "Edhi Foundation",
            },
            {
              href: "/NGO/al-khidmat",
              src: "/images/al-khidmat.png",
              alt: "Al-Khidmat",
            },
            { href: "/NGO/chippa", src: "/images/chippa.png", alt: "Chhipa" },
            { href: "/NGO/sahara", src: "/images/sahara.png", alt: "Sahara" },
          ].map((ngo) => (
            <a
              key={ngo.href}
              href={ngo.href}
              className="transition transform hover:scale-105"
            >
              <img
                src={ngo.src}
                alt={ngo.alt}
                width={180}
                height={180}
                className="rounded-lg shadow-lg"
              />
            </a>
          ))}
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
