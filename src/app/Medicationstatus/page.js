'use client';

import { useState, useEffect } from 'react';

const MedicationStatus = () => {
    const [medications, setMedications] = useState([]);

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const res = await fetch('/api/auth/Medications'); // Fetch data from DB
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();
                setMedications(data);
            } catch (err) {
                console.error("Error fetching medications:", err);
            }
        };

        fetchMedications();
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            medications.forEach(med => {
                if (med.dosageTime === currentTime) {
                    alert(`Time to take your ${med.name}`);
                }
            });
        };

        const interval = setInterval(checkReminders, 60000);
        return () => clearInterval(interval);
    }, [medications]);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-green-700 text-center mb-8">💊 Medication Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medications.map(med => (
                    <div key={med.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 hover:shadow-2xl transition-all">
                        <h3 className="text-xl font-semibold text-gray-900">{med.name}</h3>
                        <p className="text-gray-700"><span className="font-medium">Stock:</span> <strong>{med.stock}</strong> / {med.total}</p>

                        {/* Custom Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
                            <div 
                                className={`h-4 rounded-full transition-all ${med.stock / med.total > 0.3 ? 'bg-green-500' : 'bg-red-500'}`} 
                                style={{ width: `${(med.stock / med.total) * 100}%` }}>
                            </div>
                        </div>

                        <p className="text-gray-700 mt-3"><span className="font-medium">Next Dose:</span> <strong>{med.dosageTime}</strong></p>

                        {med.stock <= 5 && (
                            <p className="text-red-600 font-bold mt-3">⚠️ Running Low! Refill Soon</p>
                        )}

                        {/* Custom Button */}
                        <button className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition duration-300">
                            Request Refill
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicationStatus;