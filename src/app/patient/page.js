"use client";

import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchGeminiResponse } from "../services/geminiAPI"; // Import Gemini API service
import Header from "../components/Header/page";
import Footer from "../components/footer/page";
import "./page.css";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Landing from "./components/Landing/page";
import Landing from "../components/Landing/page";
export default function PatientDashboard() {
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [patient, setPatient] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/getUser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setPatient(data.patient);

        // Store patient ID in localStorage for backup access
        if (data.patient && data.patient.patient_id) {
          localStorage.setItem("patientId", data.patient.patient_id.toString());
        }
      } else router.push("/patient/login");
    } catch (error) {
      router.push("/patient/login");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear storage
    localStorage.clear();
    sessionStorage.clear();

    // Show message
    toast.success("Logged out successfully");

    // Hard redirect
    window.location.href = "/";
  };

  // ✅ Updated Chatbot Toggle with button visibility
  const toggleChat = () => {
    setChatVisible((prevState) => !prevState);
    // Toggle button class
    const chatbotBtn = document.querySelector(".chatbot-btn");
    if (chatbotBtn) {
      if (!chatVisible) {
        chatbotBtn.classList.add("hidden");
      } else {
        setTimeout(() => {
          chatbotBtn.classList.remove("hidden");
        }, 300); // Match the transition duration
      }
    }
  };

  const sendMessage = async () => {
    if (chatInput.trim()) {
      const userMessage = { text: chatInput, sender: "user" };

      // Update messages immediately for UI responsiveness
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // Clear input field
      setChatInput("");

      try {
        // Fetch AI response from Gemini API
        const botResponse = await fetchGeminiResponse(chatInput);

        // Ensure botResponse is valid, otherwise use fallback message
        const botMessage = botResponse || "Sorry, I couldn't understand that.";

        // Add bot response to chat messages
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Chatbot Error:", error);

        // Handle API failure with an error message
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, I am having trouble responding right now.",
            sender: "bot",
          },
        ]);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <ToastContainer />
      <Header />

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="container">
        <div className="card">
          <div className="welcome-section">
            <h1 className="title">Patient Dashboard</h1>
            <h2 className="welcome-text">Welcome, {patient.full_name}</h2>
            <p className="description">
              Manage your profile, request assistance, and track your medication
              all in one place. We're here to help you with your healthcare
              journey.
            </p>
          </div>

          <div className="grid">
            <Link href="/patient/profile" className="link">
              <span>👤 View Profile</span>
            </Link>
            <Link href="/patient/requestassistance" className="link">
              <span>🤝 Request Assistance</span>
            </Link>
            <Link href="/patient/Medicationstatus" className="link">
              <span>💊 Medication Status</span>
            </Link>
            <Link
              href={`/NGO/pharma?id=${patient.patient_id}`}
              className="link"
            >
              <span>🏥 NGO & Pharma Responses</span>
            </Link>
            <Link
              href={`/patient/appointments?id=${patient.patient_id}`}
              className="link"
            >
              <span>📅 Appointments</span>
            </Link>
            <Link href="/appointment/book" className="link">
              <span>🗓️ Book Appointment</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bottom-right-controls">
        <button
          onClick={toggleChat}
          className={`chatbot-btn ${chatVisible ? "hidden" : ""}`}
        >
          Need Help? 💬
        </button>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      {chatVisible && (
        <div className="chatbox visible">
          <div className="chatbox-header" onClick={toggleChat}>
            How can I help you today?
          </div>

          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.sender === "user" ? "user-message" : "bot-message"
                }`}
              >
                {msg.sender === "user" ? (
                  msg.text
                ) : (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                )}
              </div>
            ))}
          </div>

          <div className="chatbox-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage} className="send-btn">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
