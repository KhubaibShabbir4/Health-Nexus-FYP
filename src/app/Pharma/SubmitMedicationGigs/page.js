"use client";

import { useState } from "react";
import Head from "next/head";
import Footer from "../../components/footer/page";
import Link from "next/link";
import "./page.css";

export default function SubmitMedicationGigs() {
  // Sample data for NGO medication requests
  const [requests, setRequests] = useState([
    {
      id: 1,
      ngo: "Akhuwat Foundation",
      medication: "Paracetamol 500mg",
      quantity: 5000,
      dueDate: "2023-12-15",
      status: "Pending",
      isEditing: false,
      editedQuantity: 5000
    },
    {
      id: 2,
      ngo: "Saylani Welfare",
      medication: "Amoxicillin 250mg",
      quantity: 2000,
      dueDate: "2023-12-20",
      status: "Pending",
      isEditing: false,
      editedQuantity: 2000
    },
    {
      id: 3,
      ngo: "JDC Foundation",
      medication: "Insulin 100ml",
      quantity: 500,
      dueDate: "2023-12-10",
      status: "Urgent",
      isEditing: false,
      editedQuantity: 500
    },
    {
      id: 4,
      ngo: "MAA Foundation",
      medication: "Vitamin C 1000mg",
      quantity: 10000,
      dueDate: "2024-01-05",
      status: "Pending",
      isEditing: false,
      editedQuantity: 10000
    },
    {
      id: 5,
      ngo: "Edhi Foundation",
      medication: "Omeprazole 20mg",
      quantity: 3000,
      dueDate: "2023-12-25",
      status: "Pending",
      isEditing: false,
      editedQuantity: 3000
    }
  ]);

  // Function to toggle editing mode for a specific request
  const toggleEdit = (id) => {
    setRequests(requests.map(request => 
      request.id === id 
        ? { ...request, isEditing: !request.isEditing } 
        : request
    ));
  };

  // Function to update the edited quantity
  const updateEditedQuantity = (id, value) => {
    const numericValue = parseInt(value) || 0;
    setRequests(requests.map(request => 
      request.id === id 
        ? { ...request, editedQuantity: numericValue } 
        : request
    ));
  };

  // Function to handle fulfilling a request
  const handleFulfill = (id) => {
    const request = requests.find(r => r.id === id);
    
    if (request.editedQuantity > request.quantity) {
      alert(`Error: You cannot offer more than the requested quantity (${request.quantity} units).`);
      return;
    }
    
    if (request.editedQuantity <= 0) {
      alert("Error: Quantity must be greater than zero.");
      return;
    }

    // Check if offering partial quantity
    if (request.editedQuantity < request.quantity) {
      // Confirm partial fulfillment
      if (confirm(`You are offering ${request.editedQuantity} units out of ${request.quantity} requested. A notification will be sent to ${request.ngo}. Proceed?`)) {
        // In a real app, this would send the notification to the NGO
        alert(`Notification sent to ${request.ngo}: A pharmacy is offering ${request.editedQuantity} units of ${request.medication} out of your requested ${request.quantity} units.`);
        
        // Update the request status
        setRequests(requests.map(r => 
          r.id === id 
            ? { 
                ...r, 
                status: "Partially Fulfilled", 
                isEditing: false,
                quantity: r.editedQuantity // Update the displayed quantity to what was offered
              } 
            : r
        ));
      }
    } else {
      // Full fulfillment
      alert(`Submitting GIG for request ID: ${id} with ${request.quantity} units of ${request.medication}`);
      
      // Update the request status
      setRequests(requests.map(r => 
        r.id === id 
          ? { ...r, status: "Fulfilled", isEditing: false } 
          : r
      ));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Submit Medication GIGs - Health Nexus</title>
        <meta name="description" content="Submit medication GIGs for NGO requests" />
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
          NGO Medication Requests
        </h1>
        
        {/* Instructions */}
        <div className="instructions-container mb-8">
          <h2 className="text-xl font-semibold mb-2">How to Submit GIGs:</h2>
          <ol className="list-decimal pl-6">
            <li>Review the medication requests from NGOs below</li>
            <li>If you can't fulfill the entire quantity, click the edit icon to adjust the quantity</li>
            <li>Click "Submit GIG" to fulfill the request (NGO will be notified if partial quantity)</li>
            <li>Complete the required details in the following form</li>
          </ol>
        </div>

        {/* Requests Table */}
        <div className="requests-container">
          <div className="overflow-x-auto">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>NGO</th>
                  <th>Medication</th>
                  <th>Quantity</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request.id}>
                    <td>{request.ngo}</td>
                    <td>{request.medication}</td>
                    <td>
                      {request.isEditing ? (
                        <div className="quantity-edit">
                          <input
                            type="number"
                            value={request.editedQuantity}
                            onChange={(e) => updateEditedQuantity(request.id, e.target.value)}
                            min="1"
                            max={request.quantity}
                            className="quantity-input"
                          />
                          <small className="quantity-hint">Max: {request.quantity}</small>
                        </div>
                      ) : (
                        <div className="quantity-display">
                          {request.quantity} units
                          <button 
                            onClick={() => toggleEdit(request.id)} 
                            className="edit-quantity-btn"
                            title="Edit Quantity"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </td>
                    <td>{request.dueDate}</td>
                    <td>
                      <span className={`status-badge ${request.status.toLowerCase().replace(' ', '-')}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      {request.isEditing ? (
                        <div className="edit-actions">
                          <button 
                            className="save-btn"
                            onClick={() => {
                              toggleEdit(request.id);
                              if (request.editedQuantity < request.quantity) {
                                // Set visual indication that quantity has been modified
                                setRequests(requests.map(r => 
                                  r.id === request.id 
                                    ? { ...r, status: "Modified" } 
                                    : r
                                ));
                              }
                            }}
                          >
                            Save
                          </button>
                          <button 
                            className="cancel-btn"
                            onClick={() => {
                              // Reset edited quantity and exit edit mode
                              setRequests(requests.map(r => 
                                r.id === request.id 
                                  ? { ...r, isEditing: false, editedQuantity: r.quantity } 
                                  : r
                              ));
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="fulfill-btn"
                          onClick={() => handleFulfill(request.id)}
                          disabled={request.status === "Fulfilled"}
                        >
                          Submit GIG
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
