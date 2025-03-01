'use client';
import { useState } from 'react';
import AdminHeader from "../AdminHeader/page.js"; // ✅ Import the AdminHeader component
import './page.css'; // ✅ Importing global CSS file

export default function SelectAffordableGigs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [selectedGig, setSelectedGig] = useState(null); // 🔹 Selected gig for modal

  // ✅ Sample Gigs from Pharmacies
  const [gigs] = useState([
    { id: 1, title: 'Paracetamol 500mg', price: 5, pharmacyName: 'MediCare Pharmacy', description: 'Effective pain relief and fever reducer.' },
    { id: 2, title: 'Vitamin C Tablets', price: 12, pharmacyName: 'HealthPlus Pharmacy', description: 'Boosts immunity and overall wellness.' },
    { id: 3, title: 'Insulin Injection', price: 25, pharmacyName: 'PharmaCare', description: 'Essential for diabetes management.' },
    { id: 4, title: 'Cough Syrup', price: 8, pharmacyName: 'City Pharmacy', description: 'Relieves cough and throat irritation.' },
    { id: 5, title: 'Antibiotic Ointment', price: 15, pharmacyName: 'Wellness Pharmacy', description: 'Treats minor wounds and cuts.' }
  ]);

  // 🔹 Filtering and Sorting Logic
  let filteredGigs = gigs.filter((gig) =>
    gig.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortOrder === 'lowToHigh') {
    filteredGigs = [...filteredGigs].sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'highToLow') {
    filteredGigs = [...filteredGigs].sort((a, b) => b.price - a.price);
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
            placeholder="Search for medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />

          {/* 🔹 Sort by Price Dropdown */}
          <select onChange={(e) => setSortOrder(e.target.value)} className="sort-dropdown">
            <option value="">Sort by Price</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        {/* Gigs Grid */}
        <div className="gigs-grid">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gig) => (
              <div key={gig.id} className="gig-card">
                <h2 className="gig-title">{gig.title}</h2>
                <p className="gig-description">{gig.description}</p>
                <p className="gig-price">${gig.price}</p>
                <p className="pharmacy-name"><strong>Pharmacy:</strong> {gig.pharmacyName}</p>

                <div className="actions">
                  <button className="details-btn" onClick={() => setSelectedGig(gig)}>View Details</button>
                  <button className="order-btn">Order Now</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No pharmacy gigs found.</p>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {selectedGig && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedGig.title}</h2>
            <p><strong>Price:</strong> ${selectedGig.price}</p>
            <p><strong>Description:</strong> {selectedGig.description}</p>
            <p><strong>Pharmacy:</strong> {selectedGig.pharmacyName}</p>
            <button className="close-btn" onClick={() => setSelectedGig(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
