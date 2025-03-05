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

  // ✅ Fixing Chatbot Toggle Issue
  const toggleChat = () => {
    setChatVisible(prevState => !prevState);
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
    background: "white",
    border: "2px solid #28a745",
    color: "#28a745",
    fontSize: "1em",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
    padding: "10px 20px",  // ✅ Fixed padding for full border
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
    position: "relative",
    left: "-15px",
    display: "inline-block",  // ✅ Ensures proper button shape
    minWidth: "80px",  // ✅ Prevents text from being cut
    textAlign: "center"
  }}
  onMouseOver={(e) => {
    e.target.style.background = "#28a745";
    e.target.style.color = "white";
  }}
  onMouseOut={(e) => {
    e.target.style.background = "white";
    e.target.style.color = "#28a745";
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
      <div className="chatbot-container">
        {/* ✅ Reduced Button Width */}
        <button onClick={toggleChat} className="chatbot-btn" style={{ width: "110px" }}>
          Chat 💬
        </button>

        {chatVisible && (
          <div className="chatbox visible">
            {/* Chat Header */}
            <div className="chatbox-header" onClick={toggleChat}>
              How can I help you?
            </div>

            {/* Chat Messages */}
            <div className="chatbox-messages">
              {messages.map((msg, index) => (
                <div key={index} className={msg.sender === "user" ? "chat-message user-message" : "chat-message bot-message"}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="chatbox-input">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage} className="send-btn">
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
