'use client';

import { useState } from 'react';
import Header from '../Header/page'; // Importing Header component

// Simulated logged-in patient ID (Replace with authentication logic)
const currentUserId = 2; // Example: Alice Smith is logged in

const NgoPharmaResponses = () => {
    // Sample data: One request per patient, response from NGO only
    const [userRequest] = useState({
        id: 2,
        userId: 2,
        name: 'Alice Smith',
        medication: 'Insulin',
        status: 'declined', // Change to 'pending' or 'approved' to test different states
        ngoName: 'Health Aid Foundation', // The NGO handling this request
        ngoResponse: true, // True if the NGO has responded, false if pending
        responseMessage: 'Unfortunately, we cannot provide Insulin due to supply chain shortages.',
        rejectionReason: 'Supply chain disruptions and lack of stock.', // Specific reason for rejection
    });

    return (
        <>
            {/* Header Component */}
            <Header />

            {/* Added padding to create space between Header and Form */}
            <div className="p-8 max-w-4xl mx-auto mt-16">
                <h2 className="text-3xl font-bold text-green-700 text-center mb-6">🏥 NGO Aid Request Status</h2>

                <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-2xl transition-all">
                    <h3 className="text-xl font-semibold text-gray-900">{userRequest.medication}</h3>
                    
                    {/* Status Label */}
                    <p className="text-gray-700 mt-2">
                        <span className="font-medium">Status:</span>
                        <span className={`px-3 py-1 ml-2 font-bold rounded-full 
                            ${userRequest.status === 'approved' ? 'bg-green-500 text-white' :
                              userRequest.status === 'declined' ? 'bg-red-500 text-white' :
                              'bg-yellow-500 text-white'}`}>
                            {userRequest.status.charAt(0).toUpperCase() + userRequest.status.slice(1)}
                        </span>
                    </p>

                    {/* Status Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                        <div 
                            className={`h-4 rounded-full transition-all ${
                                userRequest.status === 'approved' ? 'bg-green-500 w-full' :
                                userRequest.status === 'pending' ? 'bg-yellow-500 w-2/3' :
                                'bg-red-500 w-1/3'
                            }`}>
                        </div>
                    </div>

                    {/* NGO Response */}
                    <p className="mt-4 text-gray-800 font-semibold">
                        🏥 Response from NGO: <span className="text-green-600">{userRequest.ngoName}</span>
                    </p>

                    {/* Display Personalized Response */}
                    {userRequest.ngoResponse && userRequest.status === 'approved' && (
                        <p className="mt-3 text-gray-700 italic">✅ {userRequest.responseMessage}</p>
                    )}

                    {userRequest.ngoResponse && userRequest.status === 'declined' && (
                        <div className="mt-3 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg">
                            <p className="text-red-700 font-bold">🚫 Request Declined</p>
                            <p className="text-gray-700 mt-1"><strong>Reason:</strong> {userRequest.rejectionReason}</p>
                            <p className="text-gray-700 mt-1 italic">{userRequest.responseMessage}</p>
                        </div>
                    )}

                    {userRequest.status === 'pending' && (
                        <p className="mt-3 text-gray-600">⏳ Awaiting response from <strong>{userRequest.ngoName}</strong>...</p>
                    )}
                </div>

                {/* Message if No Request Exists */}
                {!userRequest && (
                    <p className="text-gray-600 text-center mt-6">You have not submitted any requests yet.</p>
                )}
            </div>
        </>
    );
};

export default NgoPharmaResponses;
