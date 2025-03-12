'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import './page.css'; // Importing the CSS file

export default function Home() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null); // Track the selected case ID

  const caseDetails = {
    1: {
      patientName: "Asad Meeran",
      caseId: "12345",
      phoneNumber: "+xx xxxxxxxxxx",
      email: "asadmeeran@gmail.com",
      gender: "Male",
      appointmentPriority: "Normal",
      timeSlot: "10:00 am",
      date: "07/11/2024",
      age: "35 years",
      diagnosis: "Common Cold",
      medicines: ["Piriton", "Brupen", "Tixilix"],
      profileImage: "/images/asad.png",
      dosageDetails: {
        Piriton: "Take 1 tablet twice a day after meals.",
        Brupen: "Apply on the affected area three times a day.",
        Tixilix: "2 teaspoons thrice a day for cough relief.",
      },
    },
    2: {
      patientName: "Hafsa Irfan",
      caseId: "67890",
      phoneNumber: "+xx xxxxxxxxxx",
      email: "hafsairfan@gmail.com",
      gender: "Female",
      appointmentPriority: "Normal",
      timeSlot: "02:00 pm",
      date: "07/11/2024",
      age: "29 years",
      diagnosis: "Fever and Body Pain",
      medicines: ["Paracetamol", "Ibuprofen", "Antacid"],
      profileImage: "/images/hafsa.png",
      dosageDetails: {
        Paracetamol: "Take 1 tablet every 6 hours for pain relief.",
        Ibuprofen: "Take 1 tablet twice a day after food.",
        Antacid: "2 tablets as needed for acid relief.",
      },
    },
    3: {
      patientName: "Shayan Ahmad",
      caseId: "11223",
      phoneNumber: "+xx xxxxxxxxxx",
      email: "shayanahmad@gmail.com",
      gender: "Male",
      appointmentPriority: "Normal",
      timeSlot: "03:30 pm",
      date: "07/11/2024",
      age: "40 years",
      diagnosis: "Diabetes and Mild Cough",
      medicines: ["Aspirin", "Metformin", "Cough Syrup"],
      profileImage: "/images/shayan.png",
      dosageDetails: {
        Aspirin: "1 tablet daily for heart protection.",
        Metformin: "Take 500mg twice a day with meals.",
        "Cough Syrup": "2 teaspoons three times a day.",
      },
    },
    4: {
      patientName: "Female Patient",
      caseId: "767842Io98",
      phoneNumber: "+xx xxxxxxxxxx",
      email: "abcdeg@gmail.com",
      gender: "Female",
      appointmentPriority: "Urgent",
      timeSlot: "06:00 pm",
      date: "08/11/2024",
      age: "21 years",
      diagnosis: "Mild Hypertension",
      medicines: ["Amlodipine (5 mg)"],
      profileImage: "/images/female.png",
      dosageDetails: {
        "Amlodipine (5 mg)": "Take 1 tablet daily in the morning after breakfast for 30 days.",
      },
    },
  };

  const handleCaseClick = (caseId) => {
    if (selectedCaseId === caseId) {
      setSelectedCase(null);
      setSelectedMedicine(null);
      setSelectedCaseId(null);
    } else {
      setSelectedCase(caseDetails[caseId]);
      setSelectedMedicine(null);
      setSelectedCaseId(caseId);
    }
  };

  const toggleDosageDetail = (medicine) => {
    setSelectedMedicine((prev) => (prev === medicine ? null : medicine));
  };

  return (
    <div className="ngo-board">
      <header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/logo.png"
            alt="Health Nexus"
            width={80}
            height={80}
            style={{ objectFit: 'cover', cursor: 'pointer' }}
          />
          <h1>Health Nexus</h1>
        </div>
        <nav>
          <Link href="/about">About</Link>
          <Link href="/">Home</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/how-it-works">How it Works</Link>
        </nav>
      </header>
    
      <main className="main">
        <div className="cases">
          <h3>Visited Patients Details</h3>
          <ul>
            {Object.keys(caseDetails).map((caseId) => (
              <li key={caseId}>
                <button
                  className="case-button"
                  onClick={() => handleCaseClick(caseId)}
                >
                  <span className="icon">👤</span>
                  <span
                    className="case-id"
                    style={{
                      color: selectedCaseId === caseId ? 'var(--primary-color)' : 'var(--text-color)',
                    }}
                  >
                    Patient ID {caseId}
                  </span>
                  <span className="more">More</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="details">
          <h3>Patient Details</h3>
          {selectedCase ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <p><strong>Patient Name:</strong> {selectedCase.patientName}</p>
                <p><strong>Case ID:</strong> {selectedCase.caseId}</p>
                <p><strong>Phone Number:</strong> {selectedCase.phoneNumber}</p>
                <p><strong>Email:</strong> {selectedCase.email}</p>
                <p><strong>Gender:</strong> {selectedCase.gender}</p>
                <p><strong>Appointment Priority:</strong> {selectedCase.appointmentPriority}</p>
                <p><strong>Time Slot:</strong> {selectedCase.timeSlot}</p>
                <p><strong>Date:</strong> {selectedCase.date}</p>
                <p><strong>Diagnosis:</strong> {selectedCase.diagnosis}</p>
                <div style={{ backgroundColor: 'var(--button-hover-color)', padding: '10px', borderRadius: '8px' }}>
                  <h3>Prescribed Medicines</h3>
                  <ul>
                    {selectedCase.medicines.map((medicine, index) => (
                      <li key={index}>
                        <button
                          className="button"
                          onClick={() => toggleDosageDetail(medicine)}
                        >
                          {medicine}
                        </button>
                        {selectedMedicine === medicine && <p>{selectedCase.dosageDetails[medicine]}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Image src={selectedCase.profileImage} alt="Patient Image" width={250} height={250} />
            </div>
          ) : <h3>Please select a Patient to view details.</h3>}
        </div>
      </main>
    </div>
  );
}
