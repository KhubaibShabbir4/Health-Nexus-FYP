'use client';
import Link from "next/link";
import AdminHeader from "../AdminHeader/page.js"; // Import the AdminHeader component
import './page.css';

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader /> {/* Use the extracted header */}

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
            <Link href="/admin/afforable-gigs" className="link">
              Select Affordable Gigs
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Add Admin Button */}
      <Link href="/admin/create-admin">
        <button className="floating-add-admin-button">
          <span className="button-icon">+</span>
          <span className="button-text">Add Admin</span>
        </button>
      </Link>
    </>
  );
}
