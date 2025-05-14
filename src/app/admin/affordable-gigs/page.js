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
  const [showDeclineModal] = useState(false);   // modal logic kept (unused)
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
        id          : g.id,
        pharmacistId: g.pharmacistId,
        patientName : g.patientName || 'N/A',
        medication  : g.medicationName,
        quantity    : g.quantity,
        price       : g.price,
        status      : g.status || 'Pending',
        createdAt   : g.createdAt,
        notes       : g.notes,
        isProcessing: false,
      }));

      /* ───── fetch pharmacy names once ───── */
      const uniqueIds = [...new Set(transformed.map((g) => g.pharmacistId))];
      let pharmacyMap = {};

      if (uniqueIds.length) {
        const namesRes = await fetch(
          `/api/auth/getPharmacies?ids=${uniqueIds.join(',')}`
        );
        if (!namesRes.ok) throw new Error('Failed to fetch pharmacy names');

        const { pharmacies } = await namesRes.json();
        pharmacyMap = pharmacies.reduce(
          (acc, p) => ({ ...acc, [p.id]: p.name }),
          {}
        );
      }

      const withNames = transformed.map((g) => ({
        ...g,
        pharmacyName: pharmacyMap[g.pharmacistId] || 'N/A',
      }));

      const lowestPrice =
        [...withNames].sort((a, b) => a.price - b.price)[0]?.price || 0;

      setGigs(
        withNames.map((g) => ({
          ...g,
          isLowestPrice: g.price === lowestPrice,
        }))
      );
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
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

                  {/* ─────────── ACTION BUTTONS REMOVED ─────────── */}
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
