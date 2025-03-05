'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImportantFacts from '../ImportantFacts/page';
import Partners from '../partners/page';
import Footer from '../footer/page';

const navLinkStyle = {
  textDecoration: 'none',
  color: '#28a745',
  fontSize: '1em',
  fontWeight: 'bold',
};

export default function Page() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="ngo-board">
      {/* Header Section */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          width: '100%',
          height: '80px', // Reduced header height
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Logo on the left */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/logo.png"
            alt="Health Nexus"
            width={80}
            height={80}
            style={{
              objectFit: 'cover',
              cursor: 'pointer',
            }}
          />
          <h1
            style={{
              marginLeft: '10px',
              fontSize: '1.5em',
              color: '#28a745',
              fontWeight: 'bold',
            }}
          >
            Health Nexus
          </h1>
        </div>

        {/* Navigation links on the right */}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Link href="/about" style={navLinkStyle}>
            About
          </Link>
          <Link href="/" style={navLinkStyle}>
            Home
          </Link>
          <Link href="/contact" style={navLinkStyle}>
            Contact
          </Link>

          {/* Dropdown Button */}
          <div style={{ position: 'relative' }}>
          <button
  onClick={toggleDropdown}
  style={{
    background: "white",
    border: "2px solid #28a745",
    color: "#28a745",
    fontSize: "1em",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
    padding: "10px 20px",  // ✅ Fixed padding for full border
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
    position: "relative",
    left: "-15px",
    display: "inline-block",  // ✅ Ensures proper button shape
    minWidth: "80px",  // ✅ Prevents text from being cut
    textAlign: "center"
  }}
  onMouseOver={(e) => {
    e.target.style.background = "#28a745";
    e.target.style.color = "white";
  }}
  onMouseOut={(e) => {
    e.target.style.background = "white";
    e.target.style.color = "#28a745";
  }}
>
  Login
</button>


            {dropdownVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                  zIndex: 1000,
                }}
              >
                <Link
                  href="/patientlogin"
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#28a745',
                    textDecoration: 'none',
                    fontSize: '0.9em',
                  }}
                >
                  Patient
                </Link>
                <Link
                  href="/NGO_login"
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#28a745',
                    textDecoration: 'none',
                    fontSize: '0.9em',
                  }}
                >
                  NGO
                </Link>
                <Link
                  href="/doc_login"
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#28a745',
                    textDecoration: 'none',
                    fontSize: '0.9em',
                  }}
                >
                  Doctor
                </Link>
                <Link
                  href="/Pharma_Login"
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#28a745',
                    textDecoration: 'none',
                    fontSize: '0.9em',
                  }}
                >
                  Pharma Company
                </Link>
                <Link
                  href="/admin/AdminLogin"
                  style={{
                    display: 'block',
                    padding: '10px 20px',
                    color: '#28a745',
                    textDecoration: 'none',
                    fontSize: '0.9em',
                  }}
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <div style={{ paddingTop: '80px' }}>
        <main>
          {/* Statistics Section */}
          <section id="statistics" className="py-4 bg-gray-50">
            {/* First Container */}
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
              {/* Left Side: 42% Text */}
              <div className="text-center md:text-left max-w-md">
                <h2 className="text-8xl font-bold text-green-600 mb-2">42%</h2>
                <p className="text-2xl text-green-600">
                  of individuals in need in Pakistan have received aid through our website.
                </p>
              </div>

              {/* Right Side: Health Care Text */}
              <div className="text-center md:text-left max-w-md">
                <h3 className="text-4xl font-bold text-green-600">
                  Health care is expensive but not out of reach
                </h3>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <div className="bg-[#F2F2F2] py-12">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center px-8">
              {/* Left Side: Mission Text */}
              <div className="text-center md:text-left max-w-md md:mr-4 mb-4 md:mb-0">
                <p className="text-2xl font-bold text-green-600">
                  On a mission to bridge the gap between individuals in need of healthcare
                  financial assistance and reputable organizations, ensuring that everyone has
                  access to the care they deserve.
                </p>
              </div>

              {/* Right Side: Map */}
              <div className="Group258 w-[600px] h-[350px] relative mt-8 md:mt-0">
                <img
                  className="w-full h-full object-cover absolute left-0 top-0"
                  src="/images/map.png"
                  alt="Map of Pakistan"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <ImportantFacts />
      <div style={{ paddingBottom: '35px' }}>
        <Partners />
      </div>
      <Footer />
    </div>
  );
}
