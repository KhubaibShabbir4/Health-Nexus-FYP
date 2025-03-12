"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const navLinkStyle = {
  textDecoration: "none",
  color: "#28a745",
  fontSize: "1em",
  fontWeight: "bold",
};

export default function AdminHeader() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // Close dropdown when clicking outside
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
    <>
      <header className="admin-header">
        {/* Logo + Title in one line */}
        <div className="logo-title">
          <Image
            src="/images/logo.png"
            alt="Health Nexus"
            width={60}
            height={60}
            style={{ objectFit: "cover", cursor: "pointer" }}
          />
          <h1 className="header-title">Health Nexus Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="nav-container">
          <Link href="/about-us" style={navLinkStyle}>
            About
          </Link>
          <Link href="/admin-dash" style={navLinkStyle}>
            Home
          </Link>
          <Link href="/Contact-us" style={navLinkStyle}>
            Contact
          </Link>

          {/* Dropdown Button */}
          <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown-btn" onClick={toggleDropdown}>
              Admin Menu
            </button>
            {dropdownVisible && (
              <div className="dropdown-menu">
                <Link href="/admin/appointments" style={navLinkStyle}>
                  Manage Appointments
                </Link>
                <Link href="/admin/chatbot" style={navLinkStyle}>
                  Manage Graphs
                </Link>
                <Link href="/admin/manage-accounts" style={navLinkStyle}>
                  Manage Accounts
                </Link>
                <Link href="/admin/affordable-gigs" style={navLinkStyle}>
                  Select Affordable Gigs
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Inline CSS via styled-jsx for responsiveness */}
      <style jsx>{`
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          width: 100%;
          height: 80px;
          background-color: #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: fixed;
          top: 0;
          z-index: 1000;
        }

        .logo-title {
          display: flex;
          align-items: center;
        }

        .header-title {
          margin-left: 10px;
          color: #28a745;
          font-weight: bold;
          white-space: nowrap; /* Ensures text stays on one line */
        }

        .nav-container {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        /* Dropdown styling */
        .dropdown {
          position: relative;
        }
        .dropdown-btn {
          background: none;
          border: none;
          color: #28a745;
          font-size: 1em;
          font-weight: bold;
          cursor: pointer;
        }
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }
        .dropdown-menu :global(a) {
          /* We'll style the links inside the menu */
          padding: 10px 20px;
          color: #28a745;
          text-decoration: none;
          font-size: 0.9em;
        }

        /* Responsive adjustments: stack nav on smaller screens */
        @media (max-width: 768px) {
          .admin-header {
            flex-wrap: wrap;
            height: auto;
            padding: 0.5rem 1rem;
          }

          .logo-title {
            margin-bottom: 0.5rem;
          }

          .header-title {
            font-size: 1.2em;
          }

          .nav-container {
            width: 100%;
            justify-content: flex-start;
            flex-wrap: wrap;
            gap: 10px;
          }
          .dropdown {
            margin-left: auto; /* push dropdown to the right if needed */
          }
        }
      `}</style>
    </>
  );
}
