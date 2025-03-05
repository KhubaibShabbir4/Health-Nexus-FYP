'use client';
import { useState, useEffect } from 'react';
import AdminHeader from "../AdminHeader/page.js"; // ✅ Import the AdminHeader component
import './page.css'; // ✅ Importing global CSS file

const API_URL = "/api/auth/affordableGigs"; // ✅ API Route for fetching gig details

export default function SelectAffordableGigs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [selectedGig, setSelectedGig] = useState(null); // 🔹 Selected gig for modal
  const [gigs, setGigs] = useState([]); // 🔹 State for storing fetched gigs

  // 📌 Fetch Gigs from the database
  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setGigs(data);
    } catch (error) {
      console.error("Error fetching gigs:", error);
    }
  };

  // 🔹 Filtering and Sorting Logic
  let filteredGigs = gigs.filter((gig) =>
    gig.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortOrder === 'lowToHigh') {
    filteredGigs = [...filteredGigs].sort((a, b) => a.gigAmount - b.gigAmount);
  } else if (sortOrder === 'highToLow') {
    filteredGigs = [...filteredGigs].sort((a, b) => b.gigAmount - a.gigAmount);
  }

  return (
    <>
      <AdminHeader /> {/* ✅ Reusing the Header */}

      <div className="container">
        <h1 className="title">Select Affordable Pharmacy Gigs</h1>

        {/* Search & Sort Section */}
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search for patient names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          {/* 🔹 Sort by Price Dropdown */}
          <select onChange={(e) => setSortOrder(e.target.value)} className="sort-dropdown">
            <option value="">Sort by Amount</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        {/* Gigs Grid */}
        <div className="gigs-grid">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <div key={gig.id} className="gig-card">
                <h2 className="gig-title">Case ID: {gig.caseId}</h2>
                <p className="gig-description"><strong>Patient Name:</strong> {gig.patientName}</p>
                <p className="gig-price"><strong>Gig Amount:</strong> ${gig.gigAmount}</p>

                <div className="actions">
                  <button className="details-btn" onClick={() => setSelectedGig(gig)}>View Details</button>
                  <button className="order-btn">Order Now</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No gigs found.</p>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {selectedGig && (
        <div className="modal">
          <div className="modal-content">
            <h2>Case ID: {selectedGig.caseId}</h2>
            <p><strong>Gig Amount:</strong> ${selectedGig.gigAmount}</p>
            <p><strong>Patient Name:</strong> {selectedGig.patientName}</p>
            <button className="close-btn" onClick={() => setSelectedGig(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}