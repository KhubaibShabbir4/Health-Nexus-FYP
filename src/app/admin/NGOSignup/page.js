'use client';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";
import { useRouter } from "next/navigation"; 

const API_URL = "/api/auth/ngoSignup";

export default function NGOSignup() {
    const router = useRouter();
    const [ngo, setNgo] = useState({
        name: "",
        email: "",
        password: "",
        registrationNumber: "",
        phone: "",
        address: "",
        mission: "",
        role: "ngo",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setNgo({ ...ngo, [e.target.name]: e.target.value });
        setError("");
        setSuccessMessage("");
    };

    // ✅ Input Validations
    const validateInputs = () => {
        const { name, email, password, registrationNumber, phone, address, mission } = ngo;

        if (!name || !email || !password || !registrationNumber || !phone || !address || !mission) {
            return "All fields are required!";
        }

        // ✅ NGO Name should be at least 3 characters
        if (name.length < 3) {
            return "NGO name must be at least 3 characters long.";
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

        // ✅ Registration Number must be exactly 8 alphanumeric characters
        const registrationRegex = /^[A-Za-z0-9]{8}$/;
        if (!registrationRegex.test(registrationNumber)) {
            return "Registration number must be exactly 8 alphanumeric characters.";
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

        // ✅ Mission should be at least 20 characters
        if (mission.length < 20) {
            return "Mission statement must be at least 20 characters long.";
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
                body: JSON.stringify(ngo),
            });

            if (response.ok) {
                setNgo({
                    name: "", email: "", password: "", registrationNumber: "",
                    phone: "", address: "", mission: "", role: "ngo"
                });
                setSuccessMessage("NGO successfully registered! Redirecting to login page...");
                setTimeout(() => {
                    router.push("/NGO/login");
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.error || "Failed to register NGO.");
            }
        } catch (error) {
            console.error("Error registering NGO:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="ngo-container">
            <div className="ngo-card">
                <h2 className="ngo-title">NGO Signup</h2>
                <p className="ngo-subtitle">Register your NGO to support the community</p>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="ngo-form">
                    <div className="form-group">
                        <label>NGO Name</label>
                        <input type="text" name="name" value={ngo.name} onChange={handleChange} placeholder="Enter NGO name" required />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={ngo.email} onChange={handleChange} placeholder="Enter email" required />
                    </div>

                    <div className="form-group">
                        <label>Registration Number</label>
                        <input type="text" name="registrationNumber" value={ngo.registrationNumber} onChange={handleChange} placeholder="Enter 8-character registration number" required />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone" value={ngo.phone} onChange={handleChange} placeholder="Enter phone number" required />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" name="address" value={ngo.address} onChange={handleChange} placeholder="Enter address" required />
                    </div>

                    <div className="form-group">
                        <label>Mission Statement</label>
                        <textarea name="mission" value={ngo.mission} onChange={handleChange} placeholder="Describe your mission" required></textarea>
                    </div>

                    {/* Password Field with Eye Icon */}
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={ngo.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="ngo-submit">Register</button>
                </form>
            </div>
        </div>
    );
}
