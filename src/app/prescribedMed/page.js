'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from 'next/link';
import './page.css'; // Importing the CSS file

export default function Home() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null); // Track the selected case ID
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cases, setCases] = useState([]); // Store the cases data from the API
  const [error, setError] = useState(null); // Error state

  // Fetch all cases and their prescribed medicines
  const fetchCases = async () => {
    try {
      const response = await fetch('/api/auth/getCases'); // Fetch from the API
      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }
      const data = await response.json();

      console.log("Raw API response:", data); // Debug API response format

      // Ensure prescribedMedicines field is parsed correctly
      const parsedData = data.map((caseItem) => ({
        ...caseItem,
        prescribedMedicines: typeof caseItem.prescribedMedicines === 'string'
          ? caseItem.prescribedMedicines.split(',').map((medicine) => medicine.trim())
          : [], // Handle cases where the field is missing or already parsed
      }));

      console.log("Parsed cases data:", parsedData); // Debug parsed data
      setCases(parsedData); // Store the parsed cases data
    } catch (error) {
      console.error('Error fetching cases:', error); // Debug error
      setError(error.message || 'Error fetching cases');
    }
  };

  useEffect(() => {
    fetchCases(); // Fetch cases when the component mounts
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCaseClick = (caseId) => {
    if (selectedCaseId === caseId) {
      // Reset state if the same case is clicked
      setSelectedCase(null);
      setSelectedCaseId(null);
    } else {
      // Find the selected case and set it
      const caseData = cases.find(
        (c) => c.caseId === caseId || c.id === caseId || c.case_id === caseId
      ); // Ensure compatibility with different keys
      console.log("Selected case data:", caseData); // Debug selected case
      setSelectedCase(caseData);
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
        {error && <div style={{ color: 'red' }}><strong>{error}</strong></div>} {/* Display error */}

        <div className="cases">
          <h3 className="cases-title">Cases Details</h3>
          <ul>
            {cases.map((caseItem) => (
              <li key={caseItem.id || caseItem.caseId || caseItem.case_id}> {/* Use a fallback for the unique key */}
                <button
                  className={`case-button ${
                    selectedCaseId === (caseItem.caseId || caseItem.id || caseItem.case_id) ? 'selected' : ''
                  }`}
                  onClick={() => handleCaseClick(caseItem.caseId || caseItem.id || caseItem.case_id)}
                >
                  <span className="icon">👤</span>
                  CASE ID {caseItem.caseId || caseItem.id || caseItem.case_id} {/* Display the correct case ID */}
                  <span className="more">More</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="details">
          <h3 className="details-title">Patient Details</h3>
          {selectedCase ? (
            <div className="details-content">
              <div className="patient-info">
                <p>
                  <strong className="label">Patient Name:</strong>{" "}
                  <span className="patient-name">{selectedCase.patientName}</span>
                </p>
                <p>
                  <strong className="label">Case ID:</strong>{" "}
                  <span className="case-id">
                    {selectedCase.caseId || selectedCase.id || selectedCase.case_id}
                  </span>
                </p>
                <div className="dropdown">
                  <button className="dropdown-button" onClick={toggleDropdown}>
                    MEDICINES SUPPLIED
                  </button>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu">
                      {console.log("Medicines in dropdown:", selectedCase.prescribedMedicines)} {/* Debug */}
                      {selectedCase.prescribedMedicines?.length > 0 ? (
                        selectedCase.prescribedMedicines.map((medicine, index) => (
                          <li key={index}>{medicine}</li>
                        ))
                      ) : (
                        <li>No medicines prescribed</li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              <div className="patient-image">
                {selectedCase.profileImage ? (
                  <Image
                    src={selectedCase.profileImage}
                    alt="Patient Image"
                    width={300}
                    height={300}
                    className="patient-img"
                  />
                ) : (
                  <p>No Image Available</p>
                )}
              </div>
            </div>
          ) : (
            <h3 className="no-case">Select the CASE to view the details</h3>
          )}
        </div>
      </main>
    </div>
  );
}
