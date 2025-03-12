"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/page";
import { useRouter } from "next/navigation";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./page.css";

const PatientProfile = () => {
  const [patient, setPatient] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState({});
  const router = useRouter();

  // Add one-time refresh functionality
  useEffect(() => {
    // Check if this is the first visit
    const hasRefreshed = localStorage.getItem('hasRefreshedProfile');
    
    if (!hasRefreshed && typeof window !== 'undefined') {
      // Set the flag in localStorage
      localStorage.setItem('hasRefreshedProfile', 'true');
      
      // Add a small delay before refreshing to ensure localStorage is set
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, []);

  const getUser = async () => {
    try {
      const response = await fetch("/api/auth/getUser", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setPatient(data.patient);
        setEditedPatient(data.patient);
      } else {
        toast.error("Please log in to view your profile.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        router.push("/patient/login");
      }
    } catch (error) {
      toast.error("Error fetching user data. Please log in again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      router.push("/patient/login");
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/auth/updateUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient: editedPatient }),
      });
      
      if (response.ok) {
        setPatient(editedPatient);
        setIsEditing(false);
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    getUser();
  }, []);

  const renderValue = (field, label) => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={editedPatient[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="edit-input"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      );
    }
    return <div className="info-value">{patient[field]}</div>;
  };

  return (
    <div className="profile-container">
      <ToastContainer />
      <Header />
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="profile-name">{patient.full_name}</h1>
          <p className="text-white opacity-90">{patient.email}</p>
        </div>

        <div className="profile-content">
          {/* Personal Information Section */}
          <div className="section">
            <h2 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Age</div>
                <div className="info-value">{calculateAge(patient.dob)} years</div>
              </div>
              <div className="info-item">
                <div className="info-label">Gender</div>
                <div className="info-value">{patient.gender}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Phone</div>
                {renderValue('phone', 'Phone')}
              </div>
              <div className="info-item">
                <div className="info-label">Occupation</div>
                {renderValue('occupation', 'Occupation')}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="section">
            <h2 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Address Details
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Address</div>
                {renderValue('address', 'Address')}
              </div>
              <div className="info-item">
                <div className="info-label">City</div>
                {renderValue('city', 'City')}
              </div>
              <div className="info-item">
                <div className="info-label">Province</div>
                {renderValue('province', 'Province')}
              </div>
              <div className="info-item">
                <div className="info-label">Country</div>
                {renderValue('country', 'Country')}
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="section">
            <h2 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Medical Information
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Medical Condition</div>
                {renderValue('medical_condition', 'Medical Condition')}
              </div>
              <div className="info-item">
                <div className="info-label">Current Medications</div>
                {renderValue('current_medications', 'Current Medications')}
              </div>
              <div className="info-item">
                <div className="info-label">Allergies</div>
                {renderValue('allergies', 'Allergies')}
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="section">
            <h2 className="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Emergency Contact
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Name</div>
                {renderValue('emergency_contact_name', 'Emergency Contact Name')}
              </div>
              <div className="info-item">
                <div className="info-label">Relation</div>
                {renderValue('emergency_contact_relation', 'Emergency Contact Relation')}
              </div>
              <div className="info-item">
                <div className="info-label">Phone</div>
                {renderValue('emergency_contact_phone', 'Emergency Contact Phone')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              onClick={() => router.push('/appointment/book')} 
              className="action-button primary-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Appointment
            </button>
            <button 
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }} 
              className="action-button edit-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isEditing ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                )}
              </svg>
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditedPatient(patient);
                }} 
                className="action-button cancel-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            )}
            <button 
              onClick={() => router.push('/patient')} 
              className="action-button secondary-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
