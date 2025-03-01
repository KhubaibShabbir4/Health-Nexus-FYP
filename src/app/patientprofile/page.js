import React from "react";
import Header from "../Header/page"; // Importing Header Component

const PatientProfile = () => {
  return (
    <>
      <Header /> {/* Header Component */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6">
          <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">John Doe</h1>

          {/* Profile Details */}
          <section className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Profile Details</h2>
            <p className="text-gray-600"><strong>Age:</strong> 30</p>
            <p className="text-gray-600"><strong>Contact:</strong> +1234567890</p>
            <p className="text-gray-600"><strong>Email:</strong> johndoe@example.com</p>
          </section>

          {/* Medical History */}
          <section className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Medical History</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Diabetes</li>
              <li>Hypertension</li>
            </ul>
          </section>

          {/* Prescriptions */}
          <section className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Prescriptions</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Metformin</li>
              <li>Lisinopril</li>
            </ul>
          </section>

          {/* Aid Information */}
          <section className="p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-700 mb-2">Aid Information</h2>
            <p className="text-gray-600"><strong>Receiving aid from:</strong> Al-Khidmat Foundation</p>
            <p className="text-gray-600"><strong>Total aids received:</strong> 50,000</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;
