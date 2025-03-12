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
      diagnosis: "Common Cold", // Removed in JSX
      medicines: ["Piriton", "Brupen", "Tixilix"], // Dosage details will not be used anymore
      profileImage: "/images/asad.png",
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
      diagnosis: "Fever and Body Pain", // Removed in JSX
      medicines: ["Paracetamol", "Ibuprofen", "Antacid"], // Dosage details will not be used anymore
      profileImage: "/images/hafsa.png",
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
      diagnosis: "Diabetes and Mild Cough", // Removed in JSX
      medicines: ["Aspirin", "Metformin", "Cough Syrup"], // Dosage details will not be used anymore
      profileImage: "/images/shayan.png",
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
      diagnosis: "Mild Hypertension", // Removed in JSX
      medicines: ["Amlodipine (5 mg)"], // Dosage details will not be used anymore
      profileImage: "/images/female.png",
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
          <h3>Today's Appointments</h3>
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
                <p><strong>Age:</strong> {selectedCase.age}</p>
                <div className="buttons">
  <button 
    style={{ backgroundColor: 'red', color: 'white', padding: '10px 20px', borderRadius: '5px', marginRight: '10px' }}>
    Cancel
  </button>
  <Link href="/reshedule">
    <button 
      style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>
      Rescheduled
    </button>
  </Link>
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
