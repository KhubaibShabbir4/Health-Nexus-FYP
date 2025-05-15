"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../footer/page";
import NgoHeader from "../../NGOS/NgoHeader/page";
import "./page.css";
import Image from "next/image";

export default function NgoGivingLoan() {
  const router = useRouter();
  const [cases, setCases] = useState([]);
  const [Reason, setReason] = useState("");
  const [ngoAmount, setNgoAmount] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [responseMessages, setResponseMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [processedRequestIds, setProcessedRequestIds] = useState(new Set());
  const [amountError, setAmountError] = useState("");

  // Triggered by "Under Review", "Declined", or "Accepted" buttons
  const handleStatusUpdate = (status, request) => {
    setSelectedCase(request);
    setSelectedStatus(status);

    // If "Accepted," show the acceptance modal; otherwise show decline modal
    if (status === "Accepted") {
      setShowCompletedModal(true);
    } else {
      setShowDeclineModal(true);
    }
  };

  // Function to calculate remaining amount
  const calculateRemainingAmount = (request) => {
    const totalExpenditure = request.totalExpenditure || 0;
    const selfFinance = request.selfFinance || 0;
    const ngoAmount = request.ngoAmount || 0;
    return Math.max(totalExpenditure - selfFinance - ngoAmount, 0);
  };

  // Function to validate loan amount
  const validateLoanAmount = (amount, request) => {
    const totalExpenditure = request.totalExpenditure || 0;
    const selfFinance = request.selfFinance || 0;
    const remainingAmount = totalExpenditure - selfFinance - parseFloat(amount);
    
    if (remainingAmount < 0) {
      setAmountError(`Invalid amount. The remaining amount would be negative (Rs ${remainingAmount}). Please enter a valid amount.`);
      return false;
    }
    setAmountError("");
    return true;
  };

  // Sending the reason (and/or NGO amount) to the server
  const sendReason = async () => {
    if (!selectedCase || !selectedStatus) return;

    try {
      // Validate inputs before sending
      if (selectedStatus === "Accepted") {
        if (!ngoAmount || parseFloat(ngoAmount) <= 0) {
          setResponseMessages((prev) => ({
            ...prev,
            error: "Please enter a valid loan amount.",
          }));
          setTimeout(() => {
            setResponseMessages((prev) => {
              const newMessages = { ...prev };
              delete newMessages.error;
              return newMessages;
            });
          }, 7000);
          return;
        }

        // Validate that the remaining amount won't be negative
        if (!validateLoanAmount(ngoAmount, selectedCase)) {
          return;
        }
      }

      const res = await fetch("/api/auth/update-request-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCase.id,
          status: selectedStatus,
          reason: Reason,
          ngoAmount: selectedStatus === "Accepted" ? parseFloat(ngoAmount) : null,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error("API Error:", data);
        throw new Error(data.error || "Failed to update status");
      }

      // Add the processed request ID to our set
      setProcessedRequestIds(prev => new Set([...prev, selectedCase.id]));

      // Success message with status-specific prefix
      let statusIcon = "✅";
      if (selectedStatus === "Declined") {
        statusIcon = "❌";
      } else if (selectedStatus === "Under Review") {
        statusIcon = "⏳";
      }

      setResponseMessages((prev) => ({
        ...prev,
        [selectedCase.id]: {
          text: `${statusIcon} The request for ${selectedCase.fullName} has been marked as '${selectedStatus}' and notification has been sent to the patient.`,
          status: selectedStatus
        }
      }));

      // Remove the processed case from the UI
      setCases((prevCases) =>
        prevCases.filter((caseItem) => caseItem.id !== selectedCase.id)
      );

      setTimeout(() => {
        setResponseMessages((prev) => {
          const newMessages = { ...prev };
          delete newMessages[selectedCase.id];
          return newMessages;
        });
      }, 7000);
    } catch (error) {
      console.error("Error updating status:", error);
      setResponseMessages((prev) => ({
        ...prev,
        error: `Failed to update status: ${error.message}. Please try again.`,
      }));
      setTimeout(() => {
        setResponseMessages((prev) => {
          const newMessages = { ...prev };
          delete newMessages.error;
          return newMessages;
        });
      }, 5000);
    } finally {
      setShowDeclineModal(false);
      setShowCompletedModal(false);
      setReason("");
      setNgoAmount("");
      setSelectedCase(null);
      setSelectedStatus("");
      setAmountError("");
    }
  };

  // Fetch all assistance requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/auth/get-assistance-requests", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setCases(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setResponseMessages((prev) => ({
          ...prev,
          fetch: "Failed to fetch aid requests.",
        }));
      }
    };

    fetchRequests();
  }, []);

  // Filter cases based on search term
  const filteredCases = cases.filter(request => 
    request.fullName && request.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0 opacity-14">
        <Image 
          src="/images/financialaid.jpg" 
          alt="Financial Aid Background" 
          fill
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Header - Fixed Position */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NgoHeader onBellClick={() => router.push("/NGOS/Ngo_givingLoan")} />
      </div>

      {/* Main Section - With extra top padding to account for fixed header */}
      <main className="flex-grow pt-28 pb-10 px-4 md:px-6 lg:px-8 flex flex-col items-center relative z-10 max-w-6xl mx-auto">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-6 md:p-8 bg-pattern">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.push("/NGOS/NGO_home")}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 text-center">
              Recent Fund Requests
            </h1>
          </div>

          {/* Display success & error messages */}
          {Object.entries(responseMessages).map(([key, value]) => {
            // Handle both string messages (for errors) and object messages (for status notifications)
            const isErrorMessage = key === "error";
            const messageText = typeof value === "string" ? value : value.text;
            const status = typeof value === "object" ? value.status : null;
            
            // Determine styling based on message type
            let styling = "";
            if (isErrorMessage) {
              styling = "bg-red-100 text-red-700 border-l-4 border-red-500";
            } else if (status === "Accepted") {
              styling = "bg-green-100 text-green-700 border-l-4 border-green-500";
            } else if (status === "Declined") {
              styling = "bg-red-100 text-red-700 border-l-4 border-red-500";
            } else if (status === "Under Review") {
              styling = "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500";
            } else {
              styling = "bg-blue-100 text-blue-700 border-l-4 border-blue-500";
            }
            
            return (
              <p
                key={key}
                className={`text-sm md:text-base text-center font-medium mb-6 p-3 rounded-lg shadow-sm w-full max-w-3xl ${styling}`}
              >
                {messageText}
              </p>
            );
          })}

          {/* Search Bar */}
          <div className="w-full max-w-3xl mx-auto mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by patient name..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Magnifying Glass Icon */}
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              {/* Clear Search Button */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600">
                Showing {filteredCases.length} of {cases.length} cases
              </div>
            )}
          </div>

          {/* Fund Requests List */}
          <div className="space-y-6">
            {filteredCases.length === 0 ? (
              <div className="text-center py-10">
                <svg 
                  className="mx-auto h-12 w-12 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No fund requests found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try adjusting your search term." : "There are no pending fund requests at this time."}
                </p>
              </div>
            ) : (
              filteredCases.map((request) => (
                <div 
                  key={request.id} 
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-green-50">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-gray-800">{request.fullName}</h2>
                      <span className="ml-3 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        pending
                      </span>
                    </div>
                    <div>
                      <button 
                        onClick={() => router.push(`/medical-report/${request.id}`)}
                        className="inline-flex items-center text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition-colors duration-200"
                      >
                        <svg className="mr-1 h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2-1h8a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        View Medical Report
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">CNIC</p>
                            <p className="mt-1 text-sm text-gray-900">{request.cnic || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Contact</p>
                            <p className="mt-1 text-sm text-gray-900">{request.phoneNumber || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Condition</p>
                            <p className="mt-1 text-sm text-gray-900">{request.condition || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Type</p>
                            <p className="mt-1 text-sm text-gray-900">{request.assistanceType || "FINANCIAL_AID"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">NGO</p>
                        <p className="mt-1 text-sm text-gray-900">{request.ngoName || "Not assigned"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {request.createdAt 
                            ? new Date(request.createdAt).toLocaleDateString() 
                            : new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Total Expenditure</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">Rs {request.totalExpenditure || 0}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Self Finance</p>
                        <p className="mt-1 text-lg font-semibold text-gray-900">Rs {request.selfFinance || 0}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Remaining Amount</p>
                        <p className="mt-1 text-lg font-semibold text-green-600">Rs {calculateRemainingAmount(request)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-3 justify-center">
                      <button
                        onClick={() => handleStatusUpdate("Under Review", request)}
                        className="inline-flex items-center px-4 py-2 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                      >
                        <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Under Review
                      </button>
                      <button
                        onClick={() => handleStatusUpdate("Declined", request)}
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Decline
                      </button>
                      <button
                        onClick={() => handleStatusUpdate("Accepted", request)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        <svg className="mr-2 -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedStatus === "Declined" ? "Decline Request" : "Under Review"}
            </h3>
            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason
              </label>
              <textarea
                id="reason"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Please provide a reason..."
                value={Reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => {
                  setShowDeclineModal(false);
                  setReason("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedStatus === "Declined"
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                }`}
                onClick={sendReason}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Modal */}
      {showCompletedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Accept Request</h3>
            <div className="mb-4">
              <label htmlFor="ngoAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount (Rs)
              </label>
              <input
                type="number"
                id="ngoAmount"
                className={`w-full px-3 py-2 border ${amountError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                placeholder="Enter amount"
                value={ngoAmount}
                onChange={(e) => {
                  setNgoAmount(e.target.value);
                  if (e.target.value) {
                    validateLoanAmount(e.target.value, selectedCase);
                  } else {
                    setAmountError("");
                  }
                }}
              />
              {amountError && (
                <p className="mt-1 text-sm text-red-600">{amountError}</p>
              )}
              <div className="mt-2 text-sm text-gray-600">
                <p>Total Expenditure: Rs {selectedCase?.totalExpenditure || 0}</p>
                <p>Self Finance: Rs {selectedCase?.selfFinance || 0}</p>
                <p>Remaining Amount: Rs {calculateRemainingAmount(selectedCase)}</p>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="acceptReason" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                id="acceptReason"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Any additional notes..."
                value={Reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => {
                  setShowCompletedModal(false);
                  setReason("");
                  setNgoAmount("");
                  setAmountError("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={sendReason}
                disabled={!!amountError}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
