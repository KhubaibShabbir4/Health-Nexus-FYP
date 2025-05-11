'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './page.css';

export default function AffordableGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedGigId, setSelectedGigId] = useState(null);
  const [reasonError, setReasonError] = useState(false);

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const response = await fetch('/api/auth/affordableGigs');
      if (!response.ok) throw new Error('Failed to fetch gigs');
      const data = await response.json();
      
      const transformedGigs = data.gigs.map(gig => ({
        id: gig.id,
        pharmacyName: gig.pharmacyName || 'N/A',
        patientName: gig.patientName || 'N/A',
        medication: gig.medicationName,
        quantity: gig.quantity,
        price: gig.price,
        status: gig.status || 'Pending',
        createdAt: gig.createdAt,
        notes: gig.notes,
        isProcessing: false
      }));

      // Sort gigs by price to identify the lowest price
      const sortedGigs = transformedGigs.sort((a, b) => a.price - b.price);
      const lowestPrice = sortedGigs[0]?.price;

      // Add isLowestPrice flag to each gig
      const gigsWithLowestPrice = transformedGigs.map(gig => ({
        ...gig,
        isLowestPrice: gig.price === lowestPrice
      }));

      setGigs(gigsWithLowestPrice);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSelect = async (gigId) => {
    try {
      setGigs(gigs.map(gig => 
        gig.id === gigId 
          ? { ...gig, isProcessing: true }
          : gig
      ));

      const response = await fetch('/api/auth/affordableGigs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gigId, status: 'Selected' }),
      });
      
      if (!response.ok) throw new Error('Failed to update gig status');
      
      setGigs(gigs.map(gig => 
        gig.id === gigId 
          ? { ...gig, status: "Selected", isProcessing: false }
          : gig
      ));

      alert(`Gig #${gigId} has been selected successfully.`);
    } catch (err) {
      setError(err.message);
      setGigs(gigs.map(gig => 
        gig.id === gigId 
          ? { ...gig, isProcessing: false }
          : gig
      ));
    }
  };

  const openRejectModal = (gigId) => {
    setSelectedGigId(gigId);
    setRejectionReason("");
    setReasonError(false);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedGigId(null);
    setRejectionReason("");
    setReasonError(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setReasonError(true);
      return;
    }

    try {
      const response = await fetch('/api/auth/affordableGigs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gigId: selectedGigId,
          status: 'Rejected',
          rejectionReason
        }),
      });

      if (!response.ok) throw new Error('Failed to update gig status');

      setGigs(gigs.map(gig => 
        gig.id === selectedGigId 
          ? { ...gig, status: "Rejected", rejectionReason }
          : gig
      ));

      closeRejectModal();
      alert(`Gig #${selectedGigId} has been rejected.`);
    } catch (err) {
      setError(err.message);
    }
  };

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
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
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
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg self-start md:self-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {/* Search and Filter Controls */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                placeholder="Search by pharmacy or patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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

        {/* Gigs Grid */}
        <div className="grid gap-8">
          {gigs.filter(gig => {
            const matchesSearch = 
              gig.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              gig.patientName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'all' || gig.status === filterStatus;
            return matchesSearch && matchesFilter;
          }).map(gig => (
            <div
              key={gig.id}
              className={`bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border ${
                gig.isLowestPrice ? 'border-green-500 border-2' : 'border-green-100'
              } transform hover:-translate-y-1`}
            >
              {gig.isLowestPrice && (
                <div className="bg-green-500 text-white px-4 py-2 text-center font-semibold">
                  Best Price Available!
                </div>
              )}
              
              <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white bg-opacity-25 p-3 rounded-xl">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {gig.pharmacyName}
                      </h2>
                      <p className="text-green-100">
                        Gig #{gig.id} • Submitted {new Date(gig.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${
                    gig.status === 'Selected' ? 'bg-green-100 text-green-800' :
                    gig.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {gig.status}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Patient
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">{gig.patientName}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Medication
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">{gig.medication}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      Quantity
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">{gig.quantity} units</p>
                  </div>
                  <div className={`${
                    gig.isLowestPrice 
                      ? 'bg-gradient-to-br from-green-100 to-green-50' 
                      : 'bg-gradient-to-br from-pink-50 to-red-50'
                  } p-6 rounded-xl shadow-md relative overflow-hidden`}>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                      <svg className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Price
                    </h3>
                    <p className="text-2xl font-bold text-gray-900">Rs. {gig.price}</p>
                    {gig.isLowestPrice && (
                      <div className="absolute top-2 right-2">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {gig.notes && (
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl shadow-md col-span-2">
                      <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <svg className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Additional Notes
                      </h3>
                      <p className="text-lg font-semibold text-gray-900">{gig.notes}</p>
                    </div>
                  )}
                </div>

                {gig.status === 'Pending' && (
                  <div className="mt-8 flex items-center justify-end space-x-4">
                    <button
                      onClick={() => openRejectModal(gig.id)}
                      disabled={gig.isProcessing}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center"
                    >
                      <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject Gig
                    </button>
                    <button
                      onClick={() => handleSelect(gig.id)}
                      disabled={gig.isProcessing}
                      className={`px-8 py-3 bg-gradient-to-r ${
                        gig.isLowestPrice
                          ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                          : 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      } text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center`}
                    >
                      {gig.isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {gig.isLowestPrice ? 'Select Best Price' : 'Select Gig'}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {gigs.length === 0 && (
            <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-green-100">
              <div className="w-24 h-24 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Gigs Found</h3>
              <p className="text-gray-600">There are no gigs available at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Reject Gig</h3>
              </div>
              <div className="bg-white px-6 py-4">
                <p className="text-gray-600 mb-4">
                  Please provide a reason for rejecting this gig.
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    setReasonError(false);
                  }}
                  className={`w-full rounded-xl border ${
                    reasonError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 p-4`}
                  rows="4"
                  placeholder="Enter rejection reason..."
                />
                {reasonError && (
                  <p className="mt-2 text-sm text-red-600">
                    Please provide a reason for rejection
                  </p>
                )}
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                <button
                  onClick={closeRejectModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Reject Gig
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
