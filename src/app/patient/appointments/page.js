"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
const Page = () => {
  const [appointments, setAppointments] = useState([]);
  const [id, setId] = useState(0);

  useEffect(() => {
    if (id) {
      fetch(`/api/auth/get-appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
        .then((response) => response.json())
        .then((data) => setAppointments(data))
        .catch((error) => console.error("Error fetching appointments:", error));
    }
  }, [id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("id");
    setId(user_id);
  }, []);

  return (
    <div className="bg-white w-full h-screen ">
      <div className="flex flex-col items-center gap-2 py-24">
        <h1>Appointments</h1>
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="border rounded-md shadow-lg p-10 py-4 w-96"
              >
                <p className="text-lg font-semibold">Patient: {appt.name}</p>
                <p className="text-gray-700">
                  Date: {new Date(appt.date).toLocaleDateString("en-GB")} |
                  Time: {appt.time}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    appt.status === "accepted"
                      ? "text-green-600"
                      : appt.status === "rescheduled"
                      ? "text-blue-600"
                      : appt.status === "declined"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {appt.status}
                </p>
                {appt.reason && (
                  <p>
                    <strong>Reason :</strong>
                    {appt.reason}
                  </p>
                )}
                {appt.status === "completed" && (
                  <Link
                    className="text-blue-500 hover:underline"
                    href={`/patient/prescription?id=${appt.user_id}`}
                  >
                    View Prescription
                  </Link>
                )}
              </div>
            ))}
          </ul>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
