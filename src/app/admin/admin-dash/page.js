'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "../../components/Header/page"; // Import the AdminHeader component
import './page.css';

export default function AdminDashboard() {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if this is the first load
    const hasRefreshed = localStorage.getItem('hasRefreshed');
    
    if (!hasRefreshed) {
      // Set the flag in localStorage
      localStorage.setItem('hasRefreshed', 'true');
      // Refresh the page
      window.location.reload();
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <>
     <Header /> {/* Use the extracted header */}

      {/* Admin Dashboard Section */}
      <div className="container">
        <div className="card">
          <h1 className="title">Admin Dashboard</h1>
          <p className="description">
            Welcome to the admin panel. Manage appointments, chatbot, accounts, and affordable healthcare solutions.
          </p>

          <div className="grid">
            <Link href="/admin/appointments" className="link">
              Manage Appointments
            </Link>

            <Link href="/admin/manage-accounts" className="link">
              Manage Accounts
            </Link>

            <Link href="/admin/affordable-gigs" className="link">
              Pharmacies Orders
            </Link>

            {/* Dropdown Menu for "Want to register?" */}
            <div className="dropdown-container">
              <button 
                className="dropdown-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Want to register? 
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <Link href="/admin/DoctorSignup" className="dropdown-item">
                    Doctor Signup
                  </Link>
                  <Link href="/admin/PharmacySignup" className="dropdown-item">
                    Pharmacy Signup
                  </Link>
                  <Link href="/admin/NGOSignup" className="dropdown-item">
                    NGO Signup
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons Container */}
      <div className="floating-buttons-container">
        <Link href="/admin/create-admin" className="floating-button-link">
          <button className="floating-add-admin-button">
            <span className="button-icon">+</span>
            <span className="button-text">Add Admin</span>
          </button>
        </Link>
        <Link href="/components/Landing" className="floating-button-link">
          <button className="floating-logout-button">
            <span className="button-icon">↪</span>
            <span className="button-text">Logout</span>
          </button>
        </Link>
      </div>
    </>
  );
}
