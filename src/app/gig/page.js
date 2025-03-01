'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import './page.css';

export default function GigForm() {
  const params = useParams(); // Access dynamic route parameters
  const caseId = params.caseId; // Extract the caseId from the URL

  const [bids, setBids] = useState([]); // State to store bids

  // Mock fetching bids (since there's no database connectivity)
  useEffect(() => {
    const fetchBids = async () => {
      try {
        // Simulate an API call and mock response
        const mockBids = [
          { id: 1, company: 'PharmaCo', gigAmount: 200 },
          { id: 2, company: 'MediPharm', gigAmount: 250 },
        ];
        setBids(mockBids); // Update state with mock bids
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    };

    fetchBids();
  }, [caseId]);

  // Handle accepting a bid and updating the CaseStatus
  const handleAcceptBid = async (gigId, bidAmount) => {
    try {
      // Simulate accepting a bid request
      const response = { ok: true }; // Mock success response

      if (response.ok) {
        alert(`You have accepted the bid of $${bidAmount}!`);
      } else {
        alert('Error: Failed to accept the bid');
      }
    } catch (error) {
      console.error('Error accepting bid:', error);
      alert('An error occurred while accepting the bid.');
    }
  };

  return (
    <div className="gig-form-container">
      <div className="gig-box">
        <h2>Available Bids for Case {caseId}</h2>

        {/* Display the list of bids */}
        <ul className="bid-list">
          {bids.length > 0 ? (
            bids.map((bid) => (
              <li key={bid.id} className="bid-item">
                <div>
                  <strong>{bid.company}</strong> - ${bid.gigAmount}
                </div>
                <button
                  onClick={() => handleAcceptBid(bid.id, bid.gigAmount)}
                  className="accept-button"
                >
                  Accept
                </button>
              </li>
            ))
          ) : (
            <li>No bids available yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
