"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./page.css"; // Ensure this file includes appropriate styles

export default function PendingAppointments() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);

  const appointments = {
    1: {
      patientName: "Asad Meeran",
      appointmentId: "A123",
      appointmentDate: "2024-12-06",
      appointmentTime: "10:00 AM",
      profileImage: "/images/asad.png",
    },
    2: {
      patientName: "Hafsa Irfan",
      appointmentId: "A456",
      appointmentDate: "2024-12-07",
      appointmentTime: "2:00 PM",
      profileImage: "/images/asad.png",
    },
    // Add more appointments as needed
  };

  const handleAppointmentClick = (appointmentId) => {
    setSelectedAppointmentId((prev) =>
      prev === appointmentId ? null : appointmentId
    );
  };

  const handleAcceptAppointment = (appointmentId) => {
    setAcceptedAppointments((prev) => [...prev, appointmentId]);
    alert(`Appointment ${appointmentId} has been successfully accepted!`);
  };

  return (
    <div className="pending-appointments">
      {/* Header Section */}
      <header className="header">
        <div className="header-left">
          <Image
            src="/images/logo.png"
            alt="Health Nexus"
            width={80}
            height={80}
            style={{ objectFit: "cover", cursor: "pointer" }}
          />
          <h1 className="header-title">Health Nexus</h1>
        </div>
        <nav className="header-nav">
          <Link href="/about">About</Link>
          <Link href="/">Home</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/how-it-works">How it Works</Link>
        </nav>
      </header>

      {/* Main Section */}
      <main className="main">
        <div className="appointments">
          <h3 className="appointments-title">Pending Appointments</h3>
          <ul className="appointments-list">
            {Object.keys(appointments).map((id) => (
              <li key={id} className="appointment-item">
                <button
                  className="appointment-button"
                  onClick={() => handleAppointmentClick(id)}
                >
                  <span className="icon">📅</span>
                  <span
                    className="appointment-id"
                    style={{
                      color: selectedAppointmentId === id ? "#4caf50" : "#333",
                    }}
                  >
                    Appointment ID {id}
                  </span>
                  <span className="more">Details</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="details">
          <h3 className="details-title">Patient Details</h3>
          {selectedAppointmentId ? (
            <div className="appointment-details">
              <div className="appointment-info">
                <p>
                  <strong>Patient Name:</strong>{" "}
                  {appointments[selectedAppointmentId].patientName}
                </p>
                <p>
                  <strong>Appointment ID:</strong>{" "}
                  {appointments[selectedAppointmentId].appointmentId}
                </p>
                <p>
                  <strong>Appointment Date:</strong>{" "}
                  {appointments[selectedAppointmentId].appointmentDate}
                </p>
                <p>
                  <strong>Appointment Time:</strong>{" "}
                  {appointments[selectedAppointmentId].appointmentTime}
                </p>
              </div>

              <Image
                src={appointments[selectedAppointmentId].profileImage}
                alt="Patient Image"
                width={250}
                height={250}
              />
            </div>
          ) : (
            <p>Please select an appointment to view details.</p>
          )}
          {/* Accept Button in Patient Details Section */}
          <button
            className="accept-button"
            onClick={() => handleAcceptAppointment(selectedAppointmentId)}
            disabled={acceptedAppointments.includes(selectedAppointmentId)} // Disable if accepted already
          >
            {acceptedAppointments.includes(selectedAppointmentId)
              ? "Accepted"
              : "Accept"}
          </button>
        </div>
      </main>
    </div>
  );
}
