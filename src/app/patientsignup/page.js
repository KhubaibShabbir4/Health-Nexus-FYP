"use client"; 
import "./page.css";
import Footer from "../footer/page";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  // Import useRouter correctly
import Header from "../Header/page";

export default function Signup() {
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    cnic: "",
    cnicExpiry: "",
    address: "",
    city: "",
    province: "",
    country: "",
    medicalCondition: "",
    currentMedications: "",
    allergies: "",
    prescriptionFile: null,
    healthReports: null,
    financialSupport: "",
    monthlyIncome: "",
    occupation: "",
    dependents: "",
    financialProof: null,
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    preferredNGO: "",
    preferredCity: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", formData);
    router.push("/NGO_home");
  };

  return (
    <div className="container">
      <Header /> {/* Added Header component here */}
      <h2 style={{ paddingTop: "60px" }}>Patient Signup</h2>
      <form onSubmit={handleSubmit} className="form" style={{ padding: "70px" }}>
        <fieldset style={{ padding: "20px" }}>
          <legend>Personal Information</legend>
          <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="date" name="dob" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        </fieldset>

        <fieldset style={{ padding: "20px" }}>
          <legend>Medical History</legend>
          <input type="text" name="medicalCondition" placeholder="Medical Condition" onChange={handleChange} required />
          <textarea name="currentMedications" placeholder="Current Medications" onChange={handleChange}></textarea>
          <input type="text" name="allergies" placeholder="Allergies" onChange={handleChange} />
          <input type="file" name="prescriptionFile" onChange={handleFileChange} />
          <input type="file" name="healthReports" onChange={handleFileChange} />
        </fieldset>

        <fieldset style={{ padding: "20px" }}>
          <legend>Financial Information</legend>
          <select name="financialSupport" onChange={handleChange} required>
            <option value="">Need Financial Support?</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select name="monthlyIncome" onChange={handleChange} required>
            <option value="">Select Monthly Income</option>
            <option value="< 20,000">Less than 20,000</option>
            <option value="20,000 - 50,000">20,000 - 50,000</option>
            <option value="> 50,000">More than 50,000</option>
          </select>
          <input type="text" name="occupation" placeholder="Occupation" onChange={handleChange} required />
          <input type="number" name="dependents" placeholder="Number of Dependents" onChange={handleChange} required />
          <input type="file" name="financialProof" onChange={handleFileChange} />
        </fieldset>

        <fieldset style={{ padding: "20px" }}>
          <legend>Emergency Contact</legend>
          <input type="text" name="emergencyContactName" placeholder="Emergency Contact Name" onChange={handleChange} required />
          <select name="emergencyContactRelation" onChange={handleChange} required>
            <option value="">Select Relationship</option>
            <option value="Parent">Parent</option>
            <option value="Spouse">Spouse</option>
            <option value="Sibling">Sibling</option>
            <option value="Other">Other</option>
          </select>
          <input type="tel" name="emergencyContactPhone" placeholder="Emergency Contact Phone" onChange={handleChange} required />
        </fieldset>

        <button type="submit" className="submitBtn">Sign Up</button>
      </form>
    </div>
  );
}
