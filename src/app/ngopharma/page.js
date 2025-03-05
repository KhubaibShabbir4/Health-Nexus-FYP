'use client';

import { useState, useEffect } from 'react';
import Header from '../Header/page'; // Importing Header component

const currentUserId = 1; // Simulated logged-in patient ID

const NgoPharmaResponses = () => {
    const [userRequest, setUserRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch('/api/auth/AidRequest', { cache: 'no-store' });

                if (!res.ok) throw new Error('Failed to fetch data');

                const data = await res.json();
                console.log("Fetched Data:", data); // Debugging line

                const userData = data.find(request => request.patientId === currentUserId);
                console.log("User Request:", userData); // Debugging line

                if (userData) {
                    setUserRequest(userData);
                } else {
                    setError('No aid request found for this user.');
                }
            } catch (err) {
                console.error('Error fetching requests:', err);
                setError('Failed to fetch aid requests.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    return (
        <>
            {/* Header Component */}
            <Header />

            <div className="p-8 max-w-4xl mx-auto mt-16">
                <h2 className="text-3xl font-bold text-green-700 text-center mb-6">🏥 NGO Aid Request Status</h2>

                {loading ? (
                    <p className="text-center text-gray-600">⏳ Loading aid request details...</p>
                ) : error ? (
                    <p className="text-center text-red-600 font-bold">{error}</p>
                ) : (
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-2xl transition-all">
                        <h3 className="text-xl font-semibold text-gray-900">{userRequest.medicineName}</h3>

                        {/* Status Label */}
                        <p className="text-gray-700 mt-2">
                            <span className="font-medium">Status:</span>
                            <span className={`px-3 py-1 ml-2 font-bold rounded-full 
                                ${userRequest.requestStatus.toLowerCase() === 'approved' ? 'bg-green-500 text-white' :
                                userRequest.requestStatus.toLowerCase() === 'declined' ? 'bg-red-500 text-white' :
                                'bg-yellow-500 text-white'}`}>
                                {userRequest.requestStatus.charAt(0).toUpperCase() + userRequest.requestStatus.slice(1)}
                            </span>
                        </p>

                        {/* Status Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                            <div 
                                className={`h-4 rounded-full transition-all ${
                                    userRequest.requestStatus.toLowerCase() === 'approved' ? 'bg-green-500 w-full' :
                                    userRequest.requestStatus.toLowerCase() === 'pending' ? 'bg-yellow-500 w-2/3' :
                                    'bg-red-500 w-1/3'
                                }`}></div>
                        </div>

                        {/* NGO Response */}
                        <p className="mt-4 text-gray-800 font-semibold">
                            🏥 Response from NGO: <span className="text-green-600">{userRequest.ngoName || 'Not assigned yet'}</span>
                        </p>

                        {/* Display Response Message */}
                        {userRequest.requestStatus.toLowerCase() === 'approved' && (
                            <p className="mt-3 text-gray-700 italic">✅ {userRequest.response || 'Approved without comments.'}</p>
                        )}

                        {userRequest.requestStatus.toLowerCase() === 'declined' && (
                            <div className="mt-3 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg">
                                <p className="text-red-700 font-bold">🚫 Request Declined</p>
                                <p className="text-gray-700 mt-1"><strong>Reason:</strong> {userRequest.response || 'No reason provided'}</p>
                            </div>
                        )}

                        {userRequest.requestStatus.toLowerCase() === 'pending' && (
                            <p className="mt-3 text-gray-600">⏳ Awaiting response from <strong>{userRequest.ngoName || 'an NGO'}</strong>...</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default NgoPharmaResponses;