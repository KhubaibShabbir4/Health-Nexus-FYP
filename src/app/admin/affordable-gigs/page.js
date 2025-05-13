'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './page.css';

export default function AffordableGigs() {
  /* ──────────── STATE ──────────── */
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [selectedGigId, setSelectedGigId] = useState(null);
  const [reasonError, setReasonError] = useState(false);

  /* ──────────── FETCH ──────────── */
  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const res = await fetch('/api/auth/affordableGigs');
      if (!res.ok) throw new Error('Failed to fetch gigs');
      const data = await res.json();

      const transformed = data.gigs.map((g) => ({
        id: g.id,
        pharmacyName: g.pharmacyName || 'N/A',
        patientName: g.patientName || 'N/A',
        medication: g.medicationName,
        quantity: g.quantity,
        price: g.price,
        status: g.status || 'Pending',
        createdAt: g.createdAt,
        notes: g.notes,
        isProcessing: false,
      }));

      const lowestPrice = [...transformed].sort((a, b) => a.price - b.price)[0]
        ?.price;

      setGigs(
        transformed.map((g) => ({ ...g, isLowestPrice: g.price === lowestPrice }))
      );
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  /* ──────────── ACCEPT / DECLINE ──────────── */
  const handleAccept = async (gigId) => {
    try {
      setGigs((prev) =>
        prev.map((g) =>
          g.id === gigId ? { ...g, isProcessing: true } : g
        )
      );

      const res = await fetch('/api/auth/affordableGigs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gigId, status: 'Selected' }),
      });
      if (!res.ok) throw new Error('Failed to update gig status');

      setGigs((prev) =>
        prev.map((g) =>
          g.id === gigId ? { ...g, status: 'Selected', isProcessing: false } : g
        )
      );
      alert(`Gig #${gigId} has been accepted successfully.`);
    } catch (err) {
      setError(err.message);
      setGigs((prev) =>
        prev.map((g) =>
          g.id === gigId ? { ...g, isProcessing: false } : g
        )
      );
    }
  };

  const openDeclineModal = (gigId) => {
    setSelectedGigId(gigId);
    setDeclineReason('');
    setReasonError(false);
    setShowDeclineModal(true);
  };

  const closeDeclineModal = () => {
    setShowDeclineModal(false);
    setSelectedGigId(null);
    setDeclineReason('');
    setReasonError(false);
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      setReasonError(true);
      return;
    }
    try {
      const res = await fetch('/api/auth/affordableGigs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gigId: selectedGigId,
          status: 'Rejected',
          rejectionReason: declineReason,
        }),
      });
      if (!res.ok) throw new Error('Failed to update gig status');

      setGigs((prev) =>
        prev.map((g) =>
          g.id === selectedGigId
            ? { ...g, status: 'Rejected', rejectionReason: declineReason }
            : g
        )
      );
      closeDeclineModal();
      alert(`Gig #${selectedGigId} has been declined.`);
    } catch (err) {
      setError(err.message);
    }
  };

  /* ──────────── LOADING / ERROR UI ──────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative mx-auto">
            <div className="w-20 h-20 border-4 border-green-200 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-4 border-green-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
          </div>
          <p className="mt-6 text-xl font-medium text-gray-600">Loading gigs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow-md animate-fade-in max-w-2xl w-full mx-4">
          <div className="flex items-center">
            <svg
              className="h-6 w-6 text-red-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ──────────── MAIN PAGE ──────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ───── Header ───── */}
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8 border border-green-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Affordable Gigs Selection
              </h1>
              <p className="mt-2 text-gray-600">
                Compare and select the most affordable gigs for patients
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg self-start md:self-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {/* ───── Search & Filter ───── */}
          <div className="mt-6 flex flex-wrap gap-4">
            <input
              type="text"
              className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              placeholder="Search by pharmacy or patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 min-w-[150px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* ───── Gigs Grid ───── */}
        <div className="grid gap-8">
          {gigs
            .filter((g) => {
              const s = searchTerm.toLowerCase();
              const matchesSearch =
                g.pharmacyName.toLowerCase().includes(s) ||
                g.patientName.toLowerCase().includes(s);
              const matchesFilter =
                filterStatus === 'all' || g.status === filterStatus;
              return matchesSearch && matchesFilter;
            })
            .map((gig) => (
              <div
                key={gig.id}
                className={`bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border ${
                  gig.isLowestPrice
                    ? 'border-green-500 border-2'
                    : 'border-green-100'
                } transform hover:-translate-y-1`}
              >
                {/* lowest-price banner */}
                {gig.isLowestPrice && (
                  <div className="bg-green-500 text-white px-4 py-2 text-center font-semibold">
                    Best Price Available!
                  </div>
                )}

                {/* top strip */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white bg-opacity-25 p-3 rounded-xl">
                        <svg
                          className="h-8 w-8 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {gig.pharmacyName}
                        </h2>
                        <p className="text-green-100">
                          Gig #{gig.id} • Submitted{' '}
                          {new Date(gig.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full ${
                        gig.status === 'Selected'
                          ? 'bg-green-100 text-green-800'
                          : gig.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {gig.status}
                    </div>
                  </div>
                </div>

                {/* details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* patient */}
                    <DetailCard
                      icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      color="green"
                      label="Patient"
                      value={gig.patientName}
                    />
                    {/* medication */}
                    <DetailCard
                      icon="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      color="blue"
                      label="Medication"
                      value={gig.medication}
                    />
                    {/* quantity */}
                    <DetailCard
                      icon="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      color="purple"
                      label="Quantity"
                      value={`${gig.quantity} units`}
                    />
                    {/* price */}
                    <div
                      className={`${
                        gig.isLowestPrice
                          ? 'bg-gradient-to-br from-green-100 to-green-50'
                          : 'bg-gradient-to-br from-pink-50 to-red-50'
                      } p-6 rounded-xl shadow-md relative overflow-hidden`}
                    >
                      <LabelIcon
                        icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        color="pink"
                        label="Price"
                      />
                      <p className="text-2xl font-bold text-gray-900">
                        Rs. {gig.price}
                      </p>
                      {gig.isLowestPrice && (
                        <div className="absolute top-2 right-2">
                          <svg
                            className="h-6 w-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* notes */}
                    {gig.notes && (
                      <DetailCard
                        colSpan
                        icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        color="orange"
                        label="Additional Notes"
                        value={gig.notes}
                      />
                    )}
                  </div>

                  {/* ─────────── ACTION BUTTONS (always rendered) ─────────── */}
                  <div className="mt-8 flex items-center justify-end space-x-4">
                    {/* Reject */}
                    <button
                      onClick={() => openDeclineModal(gig.id)}
                      disabled={gig.isProcessing || gig.status !== 'Pending'}
                      className={`px-6 py-3 rounded-xl transition-all duration-300 shadow-md flex items-center
                        ${
                          gig.status === 'Rejected'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-600 hover:to-red-700'
                        }
                        disabled:opacity-140`}
                    >
                      <svg
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      {gig.status === 'Rejected' ? 'Rejected' : 'Reject'}
                    </button>

                    {/* Accept */}
                    <button
                      onClick={() => handleAccept(gig.id)}
                      disabled={gig.isProcessing || gig.status !== 'Pending'}
                      className={`px-8 py-3 rounded-xl transition-all duration-300 shadow-md flex items-center
                        ${
                          gig.status === 'Selected'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : gig.isLowestPrice
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                        }
                        disabled:opacity-140`}
                    >
                      {gig.isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing…
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {gig.status === 'Selected'
                            ? 'Accepted'
                            : gig.isLowestPrice
                            ? 'Accept Best Price'
                            : 'Accept'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* empty state */}
          {gigs.length === 0 && (
            <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-green-100">
              <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="h-12 w-12 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Gigs Found
              </h3>
              <p className="text-gray-600">
                There are no gigs available at this time.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ───── Decline Modal ───── */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Decline Gig</h3>
              </div>
              <div className="bg-white px-6 py-4">
                <p className="text-gray-600 mb-4">
                  Please provide a reason for declining this gig.
                </p>
                <textarea
                  value={declineReason}
                  onChange={(e) => {
                    setDeclineReason(e.target.value);
                    setReasonError(false);
                  }}
                  className={`w-full rounded-xl border ${
                    reasonError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-4`}
                  rows="4"
                  placeholder="Enter reason for declining..."
                />
                {reasonError && (
                  <p className="mt-2 text-sm text-red-600">
                    Please provide a reason for declining
                  </p>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                <button
                  onClick={closeDeclineModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDecline}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Decline Gig
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────
   Small helper components
────────────────────────── */
function LabelIcon({ icon, color, label }) {
  return (
    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
      <svg
        className={`h-5 w-5 mr-2 text-${color}-500`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
      {label}
    </h3>
  );
}

function DetailCard({ icon, color, label, value, colSpan }) {
  return (
    <div
      className={`bg-gradient-to-br from-${color}-50 to-${
        color === 'green'
          ? 'blue'
          : color === 'blue'
          ? 'purple'
          : color === 'purple'
          ? 'pink'
          : color === 'orange'
          ? 'yellow'
          : 'grey'
      }-50 p-6 rounded-xl shadow-md ${colSpan ? 'col-span-2' : ''}`}
    >
      <LabelIcon icon={icon} color={color} label={label} />
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}
