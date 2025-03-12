"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./page.css";

// Dynamically import PhoneInput with no SSR
const PhoneInput = dynamic(() => import("react-phone-input-2"), {
  ssr: false,
  loading: () => <div className="phone-input-placeholder"></div>
});

const PhoneNumberInput = ({ value, onChange }) => {
  // Client-side state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [phoneValue, setPhoneValue] = useState(value || "92");
  
  // Only render the component after mounting on the client
  useEffect(() => {
    setMounted(true);
    // Update local state if prop changes
    setPhoneValue(value || "92");
  }, [value]);
  
  const handleChange = (phone) => {
    // Remove any non-digit characters and limit to 15 digits
    const cleanPhone = phone.replace(/\D/g, '').slice(0, 15);
    setPhoneValue(cleanPhone);
    onChange(cleanPhone);
  };
  
  // Return a placeholder during SSR or before hydration
  if (!mounted) {
    return (
      <div>
        <label className="text-lg font-semibold">Phone Number:</label>
        <div className="phone-input-placeholder" style={{ height: "40px", border: "1px solid #ccc", borderRadius: "4px" }}></div>
      </div>
    );
  }
  
  return (
    <div>
      <label className="text-lg font-semibold">Phone Number:</label>
      <PhoneInput
        country={"pk"}
        value={phoneValue}
        onChange={handleChange}
        inputStyle={{ width: "100%", height: "40px" }}
        enableSearch={true}
        disableSearchIcon={true}
        placeholder="Enter phone number"
        inputProps={{
          required: true,
          maxLength: 15
        }}
      />
      <p className="mt-2 text-gray-600">Selected Number: {phoneValue || "Not selected"}</p>
    </div>
  );
};

export default PhoneNumberInput; 