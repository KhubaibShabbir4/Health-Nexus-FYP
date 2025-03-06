"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import DoctorHeader from "../DoctorHeader/page.js"; // Import the DoctorHeader component
import "./page.css"; // Ensure this file includes appropriate styles

export default function PendingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/api/auth/PendingAppointments"); // Fetch all appointments
        const data = await response.json();
        setAppointments(data); // Update state with fetched appointments
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAppointmentClick = (appointmentId) => {
    setSelectedAppointmentId((prev) => (prev === appointmentId ? null : appointmentId));
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`/api/auth/PendingAppointments/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === appointmentId ? { ...appt, status: newStatus } : appt
          )
        );
        alert(`Appointment ${appointmentId} has been marked as ${newStatus}!`);
      } else {
        alert("Failed to update appointment.");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <div className="pending-appointments">
      {/* Use DoctorHeader Component */}
      <DoctorHeader />

      {/* Main Section */}
      <main className="main">
        <div className="appointments">
          <h3 className="appointments-title">Appointments</h3>
          
          {loading ? (
            <p>Loading appointments...</p>
          ) : (
            <ul className="appointments-list">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <li key={appointment.id} className="appointment-item">
                    <button
                      className="appointment-button"
                      onClick={() => handleAppointmentClick(appointment.id)}
                    >
                      <span className="icon">📅</span>
                      <span
                        className="appointment-id"
                        style={{
                          color: selectedAppointmentId === appointment.id ? '#4caf50' : '#333',
                        }}
                      >
                        Appointment ID {appointment.appointmentId} ({appointment.status})
                      </span>
                      <span className="more">Details</span>
                    </button>
                  </li>
                ))
              ) : (
                <p>No appointments available.</p>
              )}
            </ul>
          )}
        </div>

        {/* Appointment Details Section */}
        <div className="details">
          <h3 className="details-title">Patient Details</h3>
          {selectedAppointmentId ? (
            <div className="appointment-details">
              {appointments
                .filter((appt) => appt.id === selectedAppointmentId)
                .map((appointment) => (
                  <div key={appointment.id} className="appointment-content">
                    <div className="appointment-info">
                      <p><strong>Patient Name:</strong> {appointment.name}</p>
                      <p><strong>Email:</strong> {appointment.email}</p> {/* ✅ Display email */}
                      <p><strong>Phone Number:</strong> {appointment.phoneNumber}</p> {/* ✅ Display phone number */}
                      <p><strong>Appointment ID:</strong> {appointment.appointmentId}</p>
                      <p><strong>Appointment Date:</strong> {appointment.date}</p>
                      <p><strong>Appointment Time:</strong> {appointment.time}</p>
                    </div>

                    {/* ✅ Profile Image Positioned on Right */}
                    <div className="image-container">
                      <Image
                        src={appointment.profileImage && appointment.profileImage.trim() !== "" 
                          ? appointment.profileImage 
                          : "/images/user.png"}
                        alt="Patient Image"
                        width={250}
                        height={250}
                        className="profile-image"
                        onError={(e) => { e.target.src = "/images/user.png"; }} // Fallback if error loading image
                      />
                    </div>

                    {/* Status Buttons */}
                    <div className="status-buttons">
                      <button
                        className={`status-button ${appointment.status === "Pending" ? "active" : ""}`}
                        onClick={() => handleUpdateStatus(appointment.id, "Pending")}
                      >
                        Pending
                      </button>

                      <button
                        className={`status-button ${appointment.status === "Confirmed" ? "active" : ""}`}
                        onClick={() => handleUpdateStatus(appointment.id, "Confirmed")}
                      >
                        Confirm
                      </button>

                      <button
                        className={`status-button ${appointment.status === "Cancelled" ? "active" : ""}`}
                        onClick={() => handleUpdateStatus(appointment.id, "Cancelled")}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p>Please select an appointment to view details.</p>
          )}
        </div>
      </main>
    </div>
  );
}
