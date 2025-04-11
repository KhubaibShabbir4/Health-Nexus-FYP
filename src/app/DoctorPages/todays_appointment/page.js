"use client";

import React, { useEffect, useState } from "react";
import DoctorHeader from "../../components/Header/page";
import Footer from "../../components/footer/page";
import { useRouter } from "next/navigation";

const Appointments = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState([{}]);
  const [id, setId] = useState(0);

  const [rescheduleData, setRescheduleData] = useState({
    id: null,
    date: "",
    time: "",
  });

  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccept = async (id) => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/book-appointment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "accepted" }),
      });
      if (response.ok) {
        setAppointments(
          appointments.map((appt) =>
            appt.id === id ? { ...appt, status: "accepted" } : appt
          )
        );
        alert("Acceptance notification has been sent.");
      } else {
        alert("Failed to accept the appointment.");
      }
    } catch (error) {
      console.error("Error accepting appointment:", error);
    } finally {
      setLoading(false);
    }
  };
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
        alert("Failed to accept the completion.");
      }
    } catch (error) {
      console.error("Error accepting appointment:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleReschedule = async (id) => {
    if (!rescheduleData.date || !rescheduleData.time) {
      alert("Please select a date and time for rescheduling.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/auth/book-appointment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          date: rescheduleData.date,
          time: rescheduleData.time,
          status: "rescheduled",
        }),
      });
      if (response.ok) {
        setAppointments(
          appointments.map((appt) =>
            appt.id === id
              ? {
                  ...appt,
                  date: rescheduleData.date,
                  time: rescheduleData.time,
                  status: "rescheduled",
                }
              : appt
          )
        );
        alert("New schedule has been sent to the patient.");
        setRescheduleData({ id: null, date: "", time: "" });
      } else {
        alert("Failed to reschedule the appointment.");
      }
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (id) => {
    const reason = prompt("Enter reason for declining:");
    if (!reason) {
      alert("You must provide a reason for declining.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/auth/book-appointment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "declined", reason }),
      });
      if (response.ok) {
        setAppointments(
          appointments.map((appt) =>
            appt.id === id ? { ...appt, status: "declined" } : appt
          )
        );
        alert("Declined notification has been sent.");
      } else {
        alert("Failed to decline the appointment.");
      }
    } catch (error) {
      console.error("Error declining appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (appt) =>
      appt.doctor_id === Number(id) &&
      (searchDate ? appt.date === searchDate : true) &&
      (searchTime ? appt.time === searchTime : true) &&
      (searchId ? appt.id.toString() === searchId : true)
  );
  const getAppoinmnets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/book-appointment", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();

        setAppointments(data);
      } else router.push("/DoctorPages/doc_landing");
    } catch (error) {
      router.push("/DoctorPages/doc_landing");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    setId(id);
    getAppoinmnets();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {loading && (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-black backdrop-blur-sm bg-opacity-70 flex justify-center items-center">
          <div className="relative p-4 w-48 h-48  flex justify-center items-center">
            <div className="absolute border-4 border-gray-400 w-36 h-36 rounded-full"></div>
            <div className="absolute border-t-4 border-blue-400 w-36 h-36 rounded-full animate-spin "></div>
          </div>
        </div>
      )}
      <DoctorHeader />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Requested Appointments
        </h1>

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="mb-4 flex space-x-4">
            <input
              type="date"
              className="border p-2 rounded-lg"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <input
              type="time"
              className="border p-2 rounded-lg"
              value={searchTime}
              onChange={(e) => setSearchTime(e.target.value)}
            />
            <input
              type="number"
              placeholder="Patient ID"
              className="border p-2 rounded-lg"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>

          {filteredAppointments.map((appt) => (
            <div key={appt.id} className="border-b py-4">
              <p className="text-lg font-semibold">Patient: {appt.name}</p>
              <p className="text-gray-700">
                Date: {new Date(appt.date).toLocaleDateString("en-GB")} | Time:{" "}
                {appt.time}
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
              <div className="mt-3 flex space-x-3">
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700"
                  onClick={() => handleComplete(appt.id)}
                >
                  Completed/Finish
                </button>
                <button
                  onClick={() => handleAccept(appt.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    setRescheduleData({ id: appt.id, date: "", time: "" })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => handleDecline(appt.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
              {rescheduleData.id === appt.id && (
                <div className="mt-4">
                  <input
                    type="date"
                    className="border p-2 rounded-lg mr-2"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      setRescheduleData({
                        ...rescheduleData,
                        date: e.target.value,
                      })
                    }
                  />
                  <input
                    type="time"
                    className="border p-2 rounded-lg mr-2"
                    onChange={(e) =>
                      setRescheduleData({
                        ...rescheduleData,
                        time: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={() => handleReschedule(appt.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Appointments;
