'use client';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";

const API_URL = "/api/auth/pharmacySignup";

export default function PharmacySignup() {
    const [pharmacy, setPharmacy] = useState({
        name: "",
        email: "",
        password: "",
        licenseNumber: "",
        phone: "",
        address: "",
        services: "",
        role: "pharmacy",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setPharmacy({ ...pharmacy, [e.target.name]: e.target.value });
        setError("");
        setSuccessMessage("");
    };

    // ✅ Input Validations
    const validateInputs = () => {
        const { name, email, password, licenseNumber, phone, address, services } = pharmacy;

        if (!name || !email || !password || !licenseNumber || !phone || !address || !services) {
            return "All fields are required!";
        }

        // ✅ Pharmacy Name should be at least 3 characters
        if (name.length < 3) {
            return "Pharmacy name must be at least 3 characters long.";
        }

        // ✅ Validate Email Format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }

        // ✅ Strong Password (8+ chars, 1 uppercase, 1 number, 1 special character)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";
        }

        // ✅ License Number should be exactly 10 alphanumeric characters
        const licenseRegex = /^[A-Za-z0-9]{10}$/;
        if (!licenseRegex.test(licenseNumber)) {
            return "License number must be exactly 10 alphanumeric characters.";
        }

        // ✅ Validate Phone Number (10-15 digits)
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            return "Phone number must be between 10-15 digits.";
        }

        // ✅ Address should be at least 10 characters
        if (address.length < 10) {
            return "Address must be at least 10 characters long.";
        }

        // ✅ Services should be at least 20 characters
        if (services.length < 20) {
            return "Services description must be at least 20 characters long.";
        }

        return null; // No errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pharmacy),
            });

            if (response.ok) {
                setPharmacy({
                    name: "", email: "", password: "", licenseNumber: "",
                    phone: "", address: "", services: "", role: "pharmacy"
                });
                setSuccessMessage("Pharmacy successfully registered!");
            } else {
                const data = await response.json();
                setError(data.error || "Failed to register pharmacy.");
            }
        } catch (error) {
            console.error("Error registering pharmacy:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="pharmacy-container">
            <div className="pharmacy-card">
                <h2 className="pharmacy-title">Pharmacy Signup</h2>
                <p className="pharmacy-subtitle">Register your pharmacy to serve the community</p>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="pharmacy-form">
                    <div className="form-group">
                        <label>Pharmacy Name</label>
                        <input type="text" name="name" value={pharmacy.name} onChange={handleChange} placeholder="Enter Pharmacy name" required />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={pharmacy.email} onChange={handleChange} placeholder="Enter email" required />
                    </div>

                    <div className="form-group">
                        <label>License Number</label>
                        <input type="text" name="licenseNumber" value={pharmacy.licenseNumber} onChange={handleChange} placeholder="Enter 10-character license number" required />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone" value={pharmacy.phone} onChange={handleChange} placeholder="Enter phone number" required />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" name="address" value={pharmacy.address} onChange={handleChange} placeholder="Enter address" required />
                    </div>

                    <div className="form-group">
                        <label>Services</label>
                        <textarea name="services" value={pharmacy.services} onChange={handleChange} placeholder="Describe your pharmacy services" required></textarea>
                    </div>

                    {/* Password Field with Eye Icon */}
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={pharmacy.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="pharmacy-submit">Register</button>
                </form>
            </div>
        </div>
    );
}
