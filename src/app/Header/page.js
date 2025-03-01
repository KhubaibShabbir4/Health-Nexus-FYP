'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const navLinkStyle = {
  textDecoration: 'none',
  color: '#28a745',
  fontSize: '1em',
  fontWeight: 'bold',
};

export default function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        width: '100%',
        height: '80px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'fixed',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src="/images/logo.png"
          alt="Health Nexus"
          width={80}
          height={80}
          style={{ objectFit: 'cover', cursor: 'pointer' }}
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

      {/* Navigation Links */}
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

        {/* Login Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={toggleDropdown}
            style={{
              background: 'none',
              border: 'none',
              color: '#28a745',
              fontSize: '1em',
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'none',
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
              <Link href="/patientlogin" style={{ display: 'block', padding: '10px 20px', color: '#28a745', textDecoration: 'none', fontSize: '0.9em' }}>
                Patient
              </Link>
              <Link href="/NGO_login" style={{ display: 'block', padding: '10px 20px', color: '#28a745', textDecoration: 'none', fontSize: '0.9em' }}>
                NGO
              </Link>
              <Link href="/doc_login" style={{ display: 'block', padding: '10px 20px', color: '#28a745', textDecoration: 'none', fontSize: '0.9em' }}>
                Doctor
              </Link>
              <Link href="/Pharma_Login" style={{ display: 'block', padding: '10px 20px', color: '#28a745', textDecoration: 'none', fontSize: '0.9em' }}>
                Pharma Company
              </Link>
              <Link href="/admin/AdminLogin" style={{ display: 'block', padding: '10px 20px', color: '#28a745', textDecoration: 'none', fontSize: '0.9em' }}>
                Admin
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
