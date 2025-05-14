"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header/page";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const NgoPharmaResponses = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const router = useRouter();
  const [Requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRefreshed, setHasRefreshed] = useState(false);

  // Auto-refresh effect that runs once
  useEffect(() => {
    // Get refresh status from localStorage instead of sessionStorage for persistence
    const hasPageRefreshed = localStorage.getItem('ngoPharmapageRefreshed');
    
    if (!hasPageRefreshed && !hasRefreshed) {
      // Set the flag in localStorage to prevent future refreshes
      localStorage.setItem('ngoPharmapageRefreshed', 'true');
      setHasRefreshed(true);
      
      // Use setTimeout to give the component time to set state
      const timer = setTimeout(() => {
        window.location.reload();
      }, 100);
      
      return () => clearTimeout(timer);
    }
    
    // Mark as refreshed if the flag exists
    setHasRefreshed(true);
  }, []); // Empty dependency array means this only runs once on mount

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/auth/get-assistance-requests?id=${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        console.log("Fetched Data:", data); // Debugging line

        if (data.length === 0) {
          setError("No requests available.");
          return;
        }

        setRequests(data); // Assuming the response is an array
      } catch (err) {
        console.error("Error fetching request:", err);
        setError("Failed to fetch aid request.");
        router.push("/patient/profile");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, router]);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-500";
    
    const statusLower = status.toLowerCase();
    if (statusLower === "accepted") return "bg-green-500";
    if (statusLower === "declined") return "bg-red-500";
    if (statusLower === "pending") return "bg-yellow-500";
    if (statusLower === "under review") return "bg-blue-500";
    return "bg-gray-500";
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 relative"
      style={{
        backgroundImage: "url('/ngores.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
    >
      {/* Header Component */}
      <Header />
      
      {/* Main Content with added padding-top */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 pt-32 relative z-10">
        <div className="flex flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">
            🏥 Assistance Request Status
          </h1>
          <button 
            onClick={() => router.push("/patient")}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center transition-all shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        <div className="text-center mb-10">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track the status of your medical assistance requests and see responses from NGOs
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
            <p className="ml-4 text-lg text-gray-600">Loading your requests...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow text-center">
            <p className="text-red-600 font-medium text-lg">{error}</p>
            <Link href="/patient/requestassistance">
              <button className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition-all font-medium">
                Make a New Request
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Requests.map((request) => (
              <div 
                key={request.id} 
                className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200"
              >
                {/* Request Header */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 border-b border-gray-200">
                  <div className="flex flex-wrap items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{request.fullName}</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        <span className="font-medium">Medical Condition:</span> {request.medicalCondition}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-white font-semibold text-sm inline-flex items-center ${getStatusColor(request.Status)}`}
                      >
                        {request.Status ? 
                          request.Status.charAt(0).toUpperCase() + request.Status.slice(1) : 
                          "Status Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Request Progress */}
                <div className="p-5">
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Request Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          request.Status?.toLowerCase() === "accepted"
                            ? "bg-green-500 w-full"
                            : request.Status?.toLowerCase() === "pending"
                            ? "bg-yellow-500 w-1/3"
                            : request.Status?.toLowerCase() === "under review"
                            ? "bg-blue-500 w-2/3"
                            : "bg-red-500 w-full"
                        }`}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Submitted</span>
                      <span>Under Review</span>
                      <span>Completed</span>
                    </div>
                  </div>

                  {/* NGO Response Section */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      NGO Response Details
                    </h3>

                    {request.Status?.toLowerCase() === "accepted" ? (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-5 border border-green-100">
                        <p className="text-gray-800 font-medium mb-3">
                          NGO: <span className="text-green-700">{request.preferredNgo}</span>
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-green-100">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">NGO Contribution</p>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(request.ngoAmount || 0)}</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-100">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Your Contribution</p>
                            <p className="text-lg font-bold text-blue-600">{formatCurrency(request.selfFinance || 0)}</p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 shadow-sm border border-purple-100">
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Remaining</p>
                            <p className="text-lg font-bold text-purple-600">
                              {formatCurrency((request.totalExpenditure || 0) - (request.ngoAmount || 0) - (request.selfFinance || 0))}
                            </p>
                          </div>
                        </div>

                        {request.Reason && (
                          <div className="mt-3 bg-white p-3 rounded-lg border border-green-100">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Message from NGO:</span> {request.Reason}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : request.Status?.toLowerCase() === "declined" ? (
                      <div className="bg-red-50 border border-red-100 rounded-lg p-5">
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="font-medium text-red-700">Request Declined</p>
                            <p className="text-gray-700 mt-1">
                              <span className="font-medium">Reason:</span> {request.Reason || "No reason provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-700">
                            Awaiting response from <strong>{request.preferredNgo}</strong>. We'll notify you once there's an update.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap justify-end gap-3">
                    {request.Status?.toLowerCase() === "declined" && (
                      <Link
                        href="/patient/requestassistance"
                        className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 100-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Apply Again
                      </Link>
                    )}
                    {request.Status?.toLowerCase() === "accepted" && (
                      <Link
                        href="/appointment/book"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Book Appointment
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NgoPharmaResponses;