'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const navLinkStyle = {
  textDecoration: 'none',
  color: '#28a745',
  fontSize: '1em',
  fontWeight: 'bold',
};

export default function AdminHeader() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // ✅ Reference for detecting outside clicks

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            color: '#28a745',
            fontWeight: 'bold',
          }}
        >
          Health Nexus Admin
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
        <Link href="/about-us" style={navLinkStyle}>
          About
        </Link>
        <Link href="./admin-dash" style={navLinkStyle}>
          Home
        </Link>
        <Link href="/Contact-us" style={navLinkStyle}>
          Contact
        </Link>

        {/* Dropdown Button */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
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
            Admin Menu
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
                href="/admin/appointments"
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#28a745',
                  textDecoration: 'none',
                  fontSize: '0.9em',
                }}
              >
                Manage Appointments
              </Link>
              <Link
                href="/admin/chatbot"
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#28a745',
                  textDecoration: 'none',
                  fontSize: '0.9em',
                }}
              >
                Manage Graphs
              </Link>
              <Link
                href="/admin/manage-accounts"
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#28a745',
                  textDecoration: 'none',
                  fontSize: '0.9em',
                }}
              >
                Manage Accounts
              </Link>
              <Link
                href="/admin/affordable-gigs"
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  color: '#28a745',
                  textDecoration: 'none',
                  fontSize: '0.9em',
                }}
              >
                Select Affordable Gigs
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
