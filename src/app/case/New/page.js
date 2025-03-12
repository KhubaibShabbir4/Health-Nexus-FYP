'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import './page.css'; // Importing the CSS file

export default function Home() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [gigValue, setGigValue] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null); // Track the selected case ID
  const [cases, setCases] = useState([]); // Store fetched cases
  const [error, setError] = useState(null); // Track any errors

  // Fetch the case data from the backend when the component is mounted
  const fetchCases = async () => {
    try {
      const response = await fetch('/api/auth/getCases'); // Call the API route
      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }
      const data = await response.json();
      setCases(data); // Set the fetched cases
    } catch (error) {
      setError(error.message || 'Error fetching case data');
    }
  };

  useEffect(() => {
    fetchCases(); // Fetch cases when the component mounts
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleCaseClick = (caseId) => {
    if (selectedCaseId === caseId) {
      // If the same case is clicked, reset the state
      setSelectedCase(null);
      setSelectedMedicine(null);
      setSelectedCaseId(null);
    } else {
      // Otherwise, set the new case
      const caseData = cases.find(caseItem => caseItem.id === caseId); // Find the selected case from the fetched data
      setSelectedCase(caseData);
      setSelectedMedicine(null);
      setSelectedCaseId(caseId);
    }
  };

  const handleGigInputChange = (e) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      alert("Please enter only numerical values.");
    } else {
      setGigValue(value);
    }
  };

  const toggleDosageDetail = (medicine, index) => {
    // Ensure dosage exists and toggle dosage detail for selected medicine
    if (selectedCase?.dosage) {
      const dosageList = selectedCase.dosage.split(','); // Split dosages by comma
      const dosageForMedicine = dosageList[index];
      setSelectedMedicine((prev) => (prev === medicine ? null : { medicine, dosage: dosageForMedicine }));
    } else {
      alert("No dosage details available for this medicine.");
    }
  };

  const saveGigDetails = async () => {
    if (!gigValue || !selectedCase) {
      alert("Please select a case and enter a valid gig amount.");
      return;
    }

    try {
      const response = await fetch('/api/auth/saveGig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gigAmount: gigValue,
          caseId: selectedCase.id,
          patientName: selectedCase.patientName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save gig details");
      }

      const data = await response.json();
      alert(`Gig details saved successfully with ID: ${data.id}`);
      setGigValue(''); // Clear the input field
    } catch (error) {
      console.error(error);
      alert("Error saving gig details");
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
        {error && <div style={{ color: 'red' }}><strong>{error}</strong></div>} {/* Display error */}

        <div className="cases">
          <h3>Cases Details</h3>
          <ul>
            {cases.length === 0 ? (
              <li>No cases available.</li>
            ) : (
              cases.map((caseItem) => (
                <li key={caseItem.id}>
                  <button
                    className="case-button"
                    onClick={() => handleCaseClick(caseItem.id)} // Use case ID here
                  >
                    <span className="icon">👤</span>
                    <span
                      className="case-id"
                      style={{
                        color: selectedCaseId === caseItem.id ? 'var(--primary-color)' : 'var(--text-color)',
                      }}
                    >
                      CASE ID {caseItem.id} {/* Ensure caseId exists in the response */}
                    </span>
                    <span className="more">More</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="details">
          <h3>Patient Details</h3>
          {selectedCase ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <p><strong>Patient Name:</strong> {selectedCase.patientName}</p>
                <p><strong>Case ID:</strong> {selectedCase.caseId || selectedCase.id}</p> {/* Use caseId or fallback to id */}
                <div style={{ backgroundColor: 'var(--button-hover-color)', padding: '10px', borderRadius: '8px' }}>
                  <h3>Prescribed Medicines</h3>
                  <ul>
                    {selectedCase.prescribedMedicine && selectedCase.prescribedMedicine.split(",").map((medicine, index) => (
                      <li key={index}>
                        <button
                          className="button"
                          onClick={() => toggleDosageDetail(medicine, index)}
                        >
                          {medicine}
                        </button>
                        {selectedMedicine?.medicine === medicine && (
                          <p>{selectedMedicine.dosage || "Dosage details not available"}</p> // Show dosage for selected medicine
                        )}
                      </li>
                    ))}
                  </ul>
                  <input type="text" value={gigValue} onChange={handleGigInputChange} placeholder="ENTER YOUR GIG AMOUNT" />
                  <button className="button" onClick={saveGigDetails}>ENTER</button>
                </div>
              </div>

              {/* Ensure that the profile image only renders when the path is valid */}
              {selectedCase.profileImage && selectedCase.profileImage !== "" ? (
                <Image src={selectedCase.profileImage} alt="Patient Image" width={250} height={250} />
              ) : (
                <div>No image available</div> // Fallback if no image is provided
              )}
            </div>
          ) : <h3>Please select a case to view details.</h3>}
        </div>
      </main>
    </div>
  );
}
