'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { fetchGeminiResponse } from "../services/geminiAPI"; // Import Gemini API service
import Header from "../Header/page";
import Footer from "../footer/page";
import "./page.css";

const navLinkStyle = {
  textDecoration: "none",
  color: "#28a745",
  fontSize: "1em",
  fontWeight: "bold",
};

export default function PatientDashboard() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleChat = () => {
    setChatVisible(!chatVisible);
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
        setMessages((prevMessages) => [...prevMessages, { text: botMessage, sender: "bot" }]);
      } catch (error) {
        console.error("Chatbot Error:", error);

        // Handle API failure with an error message
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, I am having trouble responding right now.", sender: "bot" },
        ]);
      }
    }
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 40px",
          width: "100%",
          height: "80px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          position: "fixed",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image src="/images/logo.png" alt="Health Nexus" width={80} height={80} style={{ objectFit: "cover", cursor: "pointer" }} />
          <h1 style={{ marginLeft: "10px", fontSize: "1.5em", color: "#28a745", fontWeight: "bold" }}>Health Nexus</h1>
        </div>
        <nav style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px" }}>
          <Link href="/about" style={navLinkStyle}>About</Link>
          <Link href="/" style={navLinkStyle}>Home</Link>
          <Link href="/contact" style={navLinkStyle}>Contact</Link>
          <div style={{ position: "relative" }}>
            <button
              onClick={toggleDropdown}
              style={{
                background: "none",
                border: "none",
                color: "#28a745",
                fontSize: "1em",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Login
            </button>
            {dropdownVisible && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "4px",
                zIndex: 1000,
                padding: "10px"
              }}>
                <Link href="/NGO_login" style={navLinkStyle}>NGO</Link>
                <Link href="/doc_login" style={navLinkStyle}>Doctor</Link>
                <Link href="/Pharma_Login" style={navLinkStyle}>Pharma Company</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <div className="container">
        <div className="card">
          <h1 className="title">Patient Dashboard</h1>
          <p className="description">
            Welcome to your dashboard. Manage your profile, request assistance, and track your medication.
          </p>
          <div className="grid">
            <Link href="/patientprofile" className="link">View Profile</Link>
            <Link href="/requestassistance" className="link">Request Assistance</Link>
            <Link href="/Medicationstatus" className="link">Medication Status</Link>
            <Link href="/ngopharma" className="link">NGO & Pharma Responses</Link>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <div style={{ position: "fixed", bottom: "40px", right: "140px", zIndex: 1000 }}>
        <button
          onClick={toggleChat}
          style={{
            padding: "10px",
            width: "150px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "40px",
            cursor: "pointer",
          }}
        >
          Chat with AI
        </button>
        {chatVisible && (
          <div
            style={{
              width: "400px",
              height: "400px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              position: "relative",
              bottom: "40px",
              right: "0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              onClick={toggleChat}
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "10px",
                textAlign: "center",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              How can I help you?
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "5px 0" }}>
                  <span
                    style={{
                      backgroundColor: msg.sender === "user" ? "#28a745" : "#ddd",
                      color: msg.sender === "user" ? "#fff" : "#000",
                      padding: "5px 10px",
                      borderRadius: "10px",
                      display: "inline-block",
                      maxWidth: "80%",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", padding: "5px" }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                style={{ flex: 1, padding: "5px" }}
              />
              <button onClick={sendMessage} style={{ padding: "5px", backgroundColor: "#28a745", color: "#fff", border: "none" }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
