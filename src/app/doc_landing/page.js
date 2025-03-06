"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "../footer/page";
import DoctorHeader from "../DoctorHeader/page.js"; // Import the header component
import "./page.css"; // Import global styles

function DoctorDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("");

  return (
    <div className="dashboard-container">
      {/* Use the DoctorHeader Component */}
      <DoctorHeader />

      {/* Main Content */}
      <div className="content">
        <div className="dashboard-card">
          <h2 className="dashboard-title">Doctor Dashboard</h2>
          <p className="dashboard-description">
            Welcome to the Doctor Panel. Manage your appointments and keep track of your scheduled visits.
          </p>

          <div className="button-group">
            {["Pending", "Today", "Visited"].map((status) => (
              <Link key={status} href={status === "Pending" ? "/pending-appointment" : status === "Today" ? "/todays_appointment" : "#"}>
                <button
                  className={`action-button ${selectedStatus === status ? "active-button" : ""}`}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status} Appointments
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default DoctorDashboard;
