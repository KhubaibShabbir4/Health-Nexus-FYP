"use client";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header/page"; // Import the Header component correctly
import "./page.css"; // Updated CSS below
import { useState } from "react";

export default function CaseDetail() {
  const [loading, setLoading] = useState(false);
  const caseId = 1; // Example case ID; replace with dynamic data if needed

  const handleStatusChange = async (status) => {
    setLoading(true);

    const prescribedMedicine = prescribedMedicines
      .map((medicine) => medicine.split(" - ")[0])
      .join(", ");
    const dosage = prescribedMedicines
      .map((medicine) => medicine.split(" - ")[1])
      .join(", ");

    const caseDetails = {
      caseId: caseId,
      patientName: "John Doe",
      age: 45,
      gender: "Male",
      diagnosis: "Coronary Artery Disease",
      treatment: "Coronary Artery Bypass Grafting Surgery",
      status: status,
      prescribedMedicine,
      dosage,
    };

    try {
      const response = await fetch("/api/auth/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(caseDetails),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();
      console.log("Status updated successfully:", data);
      alert(`Case status updated to: ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update case status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Prescribed medicines list
  const prescribedMedicines = [
    "Aspirin 75mg - Once daily",
    "Metoprolol 50mg - Twice daily",
    "Atorvastatin 10mg - Once daily",
    "Clopidogrel 75mg - Once daily",
  ];

  return (
    <div className="container">
      <Head>
        <title>Health Nexus - Welcome</title>
        <meta name="description" content="Health Nexus NGO Module" />
      </Head>

      <Header />

      <div className="divider" />

      <div className="pageWrapper">
        <div className="headerSection">
          <h1>Case Details</h1>
        </div>

        <div className="reportSection">
          <h2 className="reportTitle">Medical Report</h2>

          <div
            className="informationSection"
            style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}
          >
            <Image
              src="/images/asad.png"
              alt="Patient"
              width={120}
              height={120}
              style={{
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <div>
              <h3>Patient Information</h3>
              <ul>
                <li>
                  <strong>Name:</strong> John Doe
                </li>
                <li>
                  <strong>Age:</strong> 45
                </li>
                <li>
                  <strong>Gender:</strong> Male
                </li>
                <li>
                  <strong>Address:</strong> 123 Main Street, Cityville
                </li>
                <li>
                  <strong>Contact:</strong> (555) 123-4567
                </li>
              </ul>
            </div>
          </div>

          <div className="informationSection">
            <h3>Medical Information</h3>
            <ul>
              <li>
                <strong>Diagnosis:</strong> Coronary Artery Disease (CAD)
              </li>
              <li>
                <strong>Symptoms:</strong> Chest pain, shortness of breath,
                fatigue
              </li>
              <li>
                <strong>Date of Diagnosis:</strong> October 15, 2024
              </li>
              <li>
                <strong>Prescribed Treatment:</strong> Coronary Artery Bypass
                Grafting (CABG) Surgery
              </li>
            </ul>
          </div>

          {/* Prescribed Medicines */}
          <div className="informationSection">
            <h3>Prescribed Medicines</h3>
            <ul>
              {prescribedMedicines.map((medicine, index) => (
                <li key={index}>{medicine}</li>
              ))}
            </ul>
          </div>

          {/* Treatment Plan */}
          <div className="informationSection">
            <h3>Treatment Plan</h3>
            <ul>
              <li>
                <strong>Treatment Required:</strong> Surgical intervention to
                improve blood flow to the heart
              </li>
              <li>
                <strong>Expected Duration of Treatment:</strong> 1 month,
                including post-operative care
              </li>
              <li>
                <strong>Estimated Cost of Treatment:</strong> $1,200
              </li>
            </ul>
          </div>

          {/* Financial Assistance Needed */}
          <div className="informationSection">
            <h3>Financial Assistance Needed</h3>
            <ul>
              <li>
                <strong>Requested Loan Amount:</strong> $1,000
              </li>
              <li>
                <strong>Purpose of Loan:</strong> To cover surgery expenses and
                associated post-operative care
              </li>
            </ul>
          </div>

          <div className="buttonGroup" style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleStatusChange("rejected")}
              className="actionButton rejectButton"
              style={{
                backgroundColor: "#ff4d4f",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
              disabled={loading}
            >
              Reject
            </button>
            <button
              onClick={() => handleStatusChange("accepted")}
              className="actionButton acceptButton"
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
              disabled={loading}
            >
              Accept
            </button>
            <button
              onClick={() => handleStatusChange("under_review")}
              className="actionButton reviewButton"
              style={{
                backgroundColor: "#ffc107",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
              }}
              disabled={loading}
            >
              Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
