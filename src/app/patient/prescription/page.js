"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
const Page = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [id, setId] = useState(0);

  useEffect(() => {
    if (id) {
      fetch(`/api/auth/getPrescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
        .then((response) => response.json())
        .then((data) => setPrescriptions(data))
        .catch((error) => console.error("Error fetching appointments:", error));
    }
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("id");
    setId(user_id);
  }, []);

  return (
    <div className="bg-white w-full h-screen p-8">
      <div className="flex flex-col items-center gap-4 py-24">
        <h1 className="text-2xl font-bold mb-4">Prescriptions</h1>
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="border p-4 rounded shadow-md w-full max-w-md"
            >
              <h2 className="text-xl font-semibold mb-2">
                Prescription ID: {prescription.id}
              </h2>
              <p>
                <strong>User ID:</strong> {prescription.user_id}
              </p>
              <div className="mb-2">
                <strong>Medicines:</strong>
                <ul className="list-disc list-inside">
                  {JSON.parse(prescription.Medicines).map((medicine, index) => (
                    <li key={index}>
                      {medicine.name} - {medicine.time} for {medicine.days} days
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Tests:</strong> {prescription.Tests}
              </p>
              <p>
                <strong>Operations:</strong> {prescription.Operations}
              </p>
              <p>
                <strong>Extra Instructions:</strong>{" "}
                {prescription.ExtraInstructions}
              </p>
            </div>
          ))
        ) : (
          <p>No prescriptions found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
