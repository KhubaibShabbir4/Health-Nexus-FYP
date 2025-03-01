'use client';

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router

const ReschedulePopup = () => {
  const router = useRouter(); // Correct useRouter for App Router
  const [reason, setReason] = useState("");

  const handleConfirmReschedule = () => {
    alert("Appointment Rescheduled with reason: " + reason);
    router.back(); // Navigate back to the previous page
  };

  const handleClosePopup = () => {
    router.back(); // Close the pop-up by navigating back
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3 style={{ color: "#FFD700" }}>⚠️ Are you sure?</h3>
        <p>
          Are you sure you want to reschedule the appointment with{" "}
          <strong>[Patient Name]</strong>?
        </p>

        <div style={{ margin: "20px 0" }}>
          <label htmlFor="reason">Reason</label>
          <textarea
            id="reason"
            placeholder="Enter your reason here..."
            style={styles.textarea}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
        </div>

        <div style={styles.buttons}>
          <button style={styles.confirmButton} onClick={handleConfirmReschedule}>
            Yes
          </button>
          <button style={styles.cancelButton} onClick={handleClosePopup}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline styles for the pop-up and overlay
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    width: "400px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    height: "80px",
    marginTop: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    padding: "8px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  confirmButton: {
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ReschedulePopup;
