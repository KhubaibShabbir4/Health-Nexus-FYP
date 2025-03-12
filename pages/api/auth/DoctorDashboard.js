"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "../footer/page";

// Spinner Component
const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
    <div style={styles.spinner}></div>
  </div>
);

function DoctorDashboard() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const toggleDropdown = () => setDropdownVisible((prev) => !prev);

  const handleStatusClick = (status) => setSelectedStatus(status);

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        alert("Session timed out due to inactivity.");
        router.replace("/Doctor/login");
      }, 60000);
    };

    const verifyUser = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.replace("/Doctor/login");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        router.replace("/Doctor/login");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
    resetTimer();

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={styles.container}>
        <Header />

        <div style={styles.welcomeSection}>
          <h2 style={styles.welcomeText}>Welcome, Dr. {user?.email}</h2>
        </div>

        <div style={styles.section}>
          <h4>Choose a Status</h4>
          <div style={styles.grid}>
            {["Pending", "Today", "Visited"].map((status) => (
              <Link
                key={status}
                href={
                  status === "Pending"
                    ? "/appointment/pending"
                    : status === "Today"
                    ? "/appointment/todays"
                    : "#"
                }
              >
                <button
                  style={{
                    ...styles.statusButton,
                    backgroundColor:
                      selectedStatus === status ? "#28a745" : "#f8f9fa",
                    color: selectedStatus === status ? "#ffffff" : "#000000",
                  }}
                  onClick={() => handleStatusClick(status)}
                >
                  {status} Appointments
                </button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer style={styles.footerContainer} />
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    color: "#333",
    backgroundColor: "#f9f9f9",
    padding: "20px",
    maxWidth: "1000px",
    margin: "20px auto",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    flex: "1",
  },
  header: {
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
  },
  footerContainer: {
    marginTop: "auto",
    backgroundColor: "#f9f9f9",
    padding: "10px 20px",
    textAlign: "center",
    borderTop: "1px solid #ddd",
  },
  logoContainer: { display: "flex", alignItems: "center" },
  logo: { objectFit: "cover", cursor: "pointer" },
  title: {
    marginLeft: "10px",
    fontSize: "1.8em",
    color: "#28a745",
    fontWeight: "bold",
  },
  nav: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "20px",
  },
  navLinkStyle: {
    textDecoration: "none",
    color: "#28a745",
    fontWeight: "bold",
    fontSize: "1em",
  },
  dropdownContainer: { position: "relative" },
  dropdownButton: {
    background: "none",
    border: "none",
    color: "#28a745",
    fontSize: "1em",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    zIndex: 1000,
  },
  dropdownItem: {
    display: "block",
    padding: "10px 20px",
    color: "#28a745",
    textDecoration: "none",
  },
  welcomeSection: {
    textAlign: "center",
    marginTop: "150px",
    marginBottom: "20px",
  },
  welcomeText: { fontSize: "2em", color: "#28a745", fontWeight: "bold" },
  section: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "white",
  },
  grid: { display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" },
  statusButton: {
    flex: "1 1 calc(30% - 10px)",
    minWidth: "150px",
    maxWidth: "200px",
    padding: "15px 10px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "center",
    transition: "all 0.2s",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ddd",
    borderTop: "4px solid #28a745",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default DoctorDashboard;
