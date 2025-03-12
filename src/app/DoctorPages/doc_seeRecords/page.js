"use client";

import React, { useState } from "react";
import DoctorHeader from "../../components/Header/page";
import Footer from "../../components/footer/page";

const SeeRecord = () => {
  const [patientId, setPatientId] = useState("");
  const [patientRecord, setPatientRecord] = useState(null);

  const fetchPatientRecord = () => {
    if (!patientId) {
      alert("Please enter a valid Patient ID.");
      return;
    }

    // Mock Data for Patient Record (Replace with API call in real implementation)
    const mockData = {
      patient_id: patientId,
      full_name: "John Doe",
      gender: "Male",
      dob: "1990-05-15",
      email: "johndoe@example.com",
      phone: "+1234567890",
      cnic: "12345-6789012-3",
      cnic_expiry: "2030-12-31",
      address: "123 Street, Example Town",
      city: "Example City",
      country: "Example Country",
      medical_condition: "Diabetes",
      current_medications: "Metformin",
      allergies: "Penicillin",
      prescription_file: "prescription.pdf",
      health_reports: ["report1.pdf", "report2.jpg"],
      emergency_contact_name: "Jane Doe",
      emergency_contact_phone: "+9876543210",
    };

    setPatientRecord(mockData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DoctorHeader />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          View Patient Record
        </h1>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="flex space-x-4 mb-4">
            <input
              type="number"
              placeholder="Enter Patient ID"
              className="border p-2 rounded-lg flex-1"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <button
              onClick={fetchPatientRecord}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Search
            </button>
          </div>

          {patientRecord && (
            <div className="mt-6 border-t pt-4">
              <h2 className="text-xl font-bold text-gray-700">
                Patient Details
              </h2>
              <p>
                <strong>Full Name:</strong> {patientRecord.full_name}
              </p>
              <p>
                <strong>Gender:</strong> {patientRecord.gender}
              </p>
              <p>
                <strong>Date of Birth:</strong> {patientRecord.dob}
              </p>
              <p>
                <strong>Email:</strong> {patientRecord.email}
              </p>
              <p>
                <strong>Phone:</strong> {patientRecord.phone}
              </p>
              <p>
                <strong>CNIC:</strong> {patientRecord.cnic} (Expiry:{" "}
                {patientRecord.cnic_expiry})
              </p>
              <p>
                <strong>Address:</strong> {patientRecord.address},{" "}
                {patientRecord.city}, {patientRecord.country}
              </p>

              <h2 className="text-xl font-bold text-gray-700 mt-4">
                Medical Information
              </h2>
              <p>
                <strong>Medical Condition:</strong>{" "}
                {patientRecord.medical_condition}
              </p>
              <p>
                <strong>Current Medications:</strong>{" "}
                {patientRecord.current_medications}
              </p>
              <p>
                <strong>Allergies:</strong> {patientRecord.allergies}
              </p>

              <h2 className="text-xl font-bold text-gray-700 mt-4">
                Attachments
              </h2>
              <p>
                <strong>Prescription:</strong>{" "}
                <a
                  href={`/${patientRecord.prescription_file}`}
                  className="text-blue-600 underline"
                >
                  Download
                </a>
              </p>
              <p>
                <strong>Health Reports:</strong>
              </p>
              <ul className="list-disc pl-5">
                {patientRecord.health_reports.map((report, index) => (
                  <li key={index}>
                    <a href={`/${report}`} className="text-blue-600 underline">
                      {report}
                    </a>
                  </li>
                ))}
              </ul>

              <h2 className="text-xl font-bold text-gray-700 mt-4">
                Emergency Contact
              </h2>
              <p>
                <strong>Name:</strong> {patientRecord.emergency_contact_name}
              </p>
              <p>
                <strong>Phone:</strong> {patientRecord.emergency_contact_phone}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SeeRecord;
