"use client";

import { useState } from "react";
import Head from "next/head";
import Footer from "../../components/footer/page";
import Link from "next/link";
import "./page.css";

export default function FulfillMedicationOrders() {
  // Sample data for pending medication orders
  const [orders, setOrders] = useState([
    {
      id: 101,
      ngoId: "NGO123",
      ngoName: "Akhuwat Foundation",
      patientName: "Ahmed Khan",
      medication: "Paracetamol 500mg",
      quantity: 5000,
      totalExpenditure: 25000,
      selfFinance: 5000,
      ngoAmount: 15000,
      status: "Pending",
      dueDate: "2023-12-15",
      preferredNgo: "Akhuwat Foundation",
      isProcessing: false
    },
    {
      id: 102,
      ngoId: "NGO456",
      ngoName: "Saylani Welfare",
      patientName: "Fatima Ali",
      medication: "Amoxicillin 250mg",
      quantity: 2000,
      totalExpenditure: 18000,
      selfFinance: 3000,
      ngoAmount: 12000,
      status: "Pending",
      dueDate: "2023-12-20",
      preferredNgo: "Saylani Welfare",
      isProcessing: false
    },
    {
      id: 103,
      ngoId: "NGO789",
      ngoName: "JDC Foundation",
      patientName: "Imran Malik",
      medication: "Insulin 100ml",
      quantity: 500,
      totalExpenditure: 50000,
      selfFinance: 10000,
      ngoAmount: 30000,
      status: "Urgent",
      dueDate: "2023-12-10",
      preferredNgo: "JDC Foundation",
      isProcessing: false
    },
    {
      id: 104,
      ngoId: "NGO321",
      ngoName: "Edhi Foundation",
      patientName: "Rabia Shahid",
      medication: "Omeprazole 20mg",
      quantity: 3000,
      totalExpenditure: 15000,
      selfFinance: 5000,
      ngoAmount: 10000,
      status: "Pending",
      dueDate: "2023-12-25",
      preferredNgo: "Edhi Foundation",
      isProcessing: false
    }
  ]);

  // State for rejection modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reasonError, setReasonError] = useState(false);

  // Function to handle order fulfillment
  const handleFulfill = async (id) => {
    // Set the order as processing
    setOrders(orders.map(order => 
      order.id === id 
        ? { ...order, isProcessing: true } 
        : order
    ));

    try {
      // Simulate API call to fulfill order
      // In a real application, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update order status
      setOrders(orders.map(order => 
        order.id === id 
          ? { ...order, status: "Fulfilled", isProcessing: false } 
          : order
      ));

      // Show success message
      alert(`Order #${id} has been fulfilled successfully. The NGO has been notified.`);
      
    } catch (error) {
      console.error("Error fulfilling order:", error);
      alert("Failed to fulfill order. Please try again.");
      
      // Reset processing state
      setOrders(orders.map(order => 
        order.id === id 
          ? { ...order, isProcessing: false } 
          : order
      ));
    }
  };

  // Function to open rejection modal
  const openRejectModal = (id) => {
    setSelectedOrderId(id);
    setRejectionReason("");
    setReasonError(false);
    setShowRejectModal(true);
  };

  // Function to close rejection modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedOrderId(null);
    setRejectionReason("");
    setReasonError(false);
  };

  // Function to handle rejection reason change
  const handleReasonChange = (e) => {
    const value = e.target.value;
    setRejectionReason(value);
    setReasonError(value.trim() === "");
  };

  // Function to handle order rejection submission
  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      setReasonError(true);
      return;
    }
    
    // Update order status
    setOrders(orders.map(order => 
      order.id === selectedOrderId 
        ? { ...order, status: "Rejected", rejectionReason: rejectionReason } 
        : order
    ));
    
    // Close modal and show confirmation
    closeRejectModal();
    alert(`Order #${selectedOrderId} has been rejected. The NGO has been notified.`);
  };

  // Function to calculate remaining amount
  const calculateRemainingAmount = (order) => {
    return Math.max(order.totalExpenditure - order.selfFinance - order.ngoAmount, 0);
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Fulfill Medication Orders - Health Nexus</title>
        <meta name="description" content="Fulfill medication orders from NGOs" />
      </Head>

      {/* Header Section */}
      <header className="fixed top-0 w-full bg-white shadow-lg z-10 flex justify-between items-center px-8 py-4">
        <div className="flex items-center">
          <Link href="/Pharma/Home">
            <img
              src="/images/logo.png"
              alt="Health Nexus"
              width={80}
              height={80}
              className="cursor-pointer"
            />
          </Link>
          <h1 className="text-2xl font-bold text-green-600 ml-4">
            Health Nexus
          </h1>
        </div>
        <nav className="flex gap-4">
          <Link href="/Pharma/Home" className="text-green-600 font-semibold">
            Dashboard
          </Link>
          <Link href="/contact" className="text-green-600 font-semibold">
            Contact
          </Link>
          <Link href="/" className="text-green-600 font-semibold">
            Logout
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-32 px-4 sm:px-8 md:px-16 bg-gray-50">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          Pending Medication Orders
        </h1>
        
        {/* Instructions */}
        <div className="instructions-container mb-8">
          <h2 className="text-xl font-semibold mb-2">How to Fulfill Orders:</h2>
          <ol className="list-decimal pl-6">
            <li>Review the medication orders from NGOs below</li>
            <li>Check order details including medication, quantity, and financial information</li>
            <li>Click "Fulfill Order" to process the request and notify the NGO</li>
            <li>If you cannot fulfill an order, click "Reject Order" and provide a reason</li>
          </ol>
        </div>

        {/* Orders List */}
        <div className="orders-container">
          {orders.length === 0 ? (
            <div className="no-orders">
              <p>No pending medication orders available at this time.</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className={`order-card ${order.status.toLowerCase()}`}>
                <div className="order-header">
                  <h3 className="order-title">Order #{order.id}</h3>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="order-body">
                  <div className="order-details">
                    <div className="detail-group">
                      <h4>NGO Information</h4>
                      <p><span>Name:</span> {order.ngoName}</p>
                      <p><span>NGO ID:</span> {order.ngoId}</p>
                    </div>
                    
                    <div className="detail-group">
                      <h4>Medication Details</h4>
                      <p><span>Patient:</span> {order.patientName}</p>
                      <p><span>Medication:</span> {order.medication}</p>
                      <p><span>Quantity:</span> {order.quantity} units</p>
                      <p><span>Due Date:</span> {order.dueDate}</p>
                    </div>
                    
                    <div className="detail-group">
                      <h4>Financial Information</h4>
                      <p><span>Total Cost:</span> {formatCurrency(order.totalExpenditure)}</p>
                      <p><span>Patient Self-Finance:</span> {formatCurrency(order.selfFinance)}</p>
                      <p><span>NGO Contribution:</span> {formatCurrency(order.ngoAmount)}</p>
                      <p className="remaining-amount"><span>Remaining Amount:</span> {formatCurrency(calculateRemainingAmount(order))}</p>
                    </div>
                  </div>
                  
                  {order.status === "Rejected" && (
                    <div className="rejection-reason">
                      <p><span>Rejection Reason:</span> {order.rejectionReason}</p>
                    </div>
                  )}
                  
                  {order.status === "Pending" || order.status === "Urgent" ? (
                    <div className="order-actions">
                      <button 
                        className={`fulfill-btn ${order.isProcessing ? 'processing' : ''}`}
                        onClick={() => handleFulfill(order.id)}
                        disabled={order.isProcessing}
                      >
                        {order.isProcessing ? 'Processing...' : 'Fulfill Order'}
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => openRejectModal(order.id)}
                        disabled={order.isProcessing}
                      >
                        Reject Order
                      </button>
                    </div>
                  ) : (
                    <div className="order-complete-message">
                      {order.status === "Fulfilled" ? (
                        <p className="success-message">This order has been fulfilled and NGO has been notified.</p>
                      ) : (
                        <p className="rejection-message">This order has been rejected.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="rejection-modal">
            <h3 className="modal-title">Reject Order #{selectedOrderId}</h3>
            <p className="modal-description">
              Please provide a reason for rejecting this order. This information will be sent to the NGO.
            </p>
            <div className="modal-content">
              <textarea
                className={`rejection-textarea ${reasonError ? 'error' : ''}`}
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={handleReasonChange}
                rows={4}
              ></textarea>
              {reasonError && (
                <p className="reason-error">Please provide a reason for rejection</p>
              )}
            </div>
            <div className="modal-actions">
              <button 
                className={`reject-confirm-btn ${!rejectionReason.trim() ? 'disabled' : ''}`}
                onClick={submitRejection}
                disabled={!rejectionReason.trim()}
              >
                Submit Rejection
              </button>
              <button 
                className="reject-cancel-btn"
                onClick={closeRejectModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
