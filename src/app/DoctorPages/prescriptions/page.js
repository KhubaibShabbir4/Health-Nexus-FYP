"use client";

import React, { useEffect, useState } from "react";
import DoctorHeader from "../../components/Header/page";
import Footer from "../../components/footer/page";
import { useRouter } from "next/navigation";

const AppointmentHistory = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState("");

  const handleComplete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/book-appointment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "completed" }),
      });
      if (response.ok) {
        setAppointments(
          appointments.map((appt) =>
            appt.id === id ? { ...appt, status: "completed" } : appt
          )
        );

        const appointment = appointments.find((appt) => appt.id === id);
        router.push(`/DoctorPages/prescriptions?id=${appointment.user_id}`);
      } else {
        alert("Failed to mark appointment as completed.");
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/book-appointment", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        router.push("/DoctorPages/doc_landing");
      }
    } catch (error) {
      router.push("/DoctorPages/doc_landing");
      console.error("Error fetching appointment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.doctor_id === Number(id) &&
      appt.status === "accepted" &&
      (searchDate ? appt.date === searchDate : true)
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    setId(id);
    getAppointments();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {loading && (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-70 flex justify-center items-center">
          <div className="relative p-4 w-48 h-48 flex justify-center items-center">
            <div className="absolute border-4 border-gray-400 w-36 h-36 rounded-full"></div>
            <div className="absolute border-t-4 border-blue-400 w-36 h-36 rounded-full animate-spin"></div>
          </div>
        </div>
      )}
      <DoctorHeader />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Appointment History
        </h1>

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4 flex space-x-4">
            <input
              type="date"
              className="border p-2 rounded-lg w-full"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="Filter by date"
            />
          </div>

          {filteredAppointments.map((appt) => (
            <div key={appt.id} className="border-b py-4">
              <p className="text-lg font-semibold">Patient: {appt.name}</p>
              <p className="text-gray-700">
                Date: {new Date(appt.date).toLocaleDateString("en-GB")}
              </p>
              <p
                className={`text-sm font-semibold ${
                  appt.status === "completed"
                    ? "text-green-600"
                    : appt.status === "accepted"
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Status: {appt.status}
              </p>
              <div className="mt-3 flex space-x-3">
                {appt.status !== "completed" && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() => handleComplete(appt.id)}
                  >
                    Mark as Completed
                  </button>
                )}
                {appt.status === "completed" && (
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() =>
                      router.push(`/DoctorPages/prescriptions?id=${appt.user_id}`)
                    }
                  >
                    Issue Prescription
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppointmentHistory;
