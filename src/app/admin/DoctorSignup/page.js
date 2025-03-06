'use client';
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./page.css";

const API_URL = "/api/auth/doctorSignup";

export default function DoctorSignup() {
    const [doctor, setDoctor] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        password: "",
        specialization: "",
        licenseNumber: "",
        experience: "",
        role: "doctor",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setDoctor({ ...doctor, [e.target.name]: e.target.value });
        setError("");
        setSuccessMessage("");
    };

    // ✅ Input Validations
    const validateInputs = () => {
        const { firstName, lastName, dob, email, password, specialization, licenseNumber, experience } = doctor;

        if (!firstName || !lastName || !dob || !email || !password || !specialization || !licenseNumber || !experience) {
            return "All fields are required!";
        }

        // ✅ Check if First & Last Name contains only alphabets
        const nameRegex = /^[A-Za-z]+$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            return "First and Last Name should contain only alphabets.";
        }

        // ✅ Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }

        // ✅ Ensure password follows strong password rules
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";
        }

        // ✅ Ensure date of birth is in the past
        const today = new Date().toISOString().split("T")[0];
        if (dob >= today) {
            return "Date of birth must be in the past.";
        }

        // ✅ License number validation (should be between 6-10 characters)
        const licenseRegex = /^[A-Za-z0-9]{6,10}$/;
        if (!licenseRegex.test(licenseNumber)) {
            return "License number must be 6-10 alphanumeric characters.";
        }

        // ✅ Experience should be a positive number
        if (parseInt(experience) < 1) {
            return "Years of experience must be at least 1 year.";
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
                body: JSON.stringify(doctor),
            });

            if (response.ok) {
                setDoctor({
                    firstName: "", lastName: "", dob: "", email: "", password: "",
                    specialization: "", licenseNumber: "", experience: "", role: "doctor"
                });
                setSuccessMessage("Doctor successfully registered!");
            } else {
                const data = await response.json();
                setError(data.error || "Failed to register doctor.");
            }
        } catch (error) {
            console.error("Error registering doctor:", error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="doctor-container">
            <div className="doctor-card">
                <h2 className="doctor-title">Doctor Signup</h2>
                <p className="doctor-subtitle">Fill in the details to register as a doctor</p>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <form onSubmit={handleSubmit} className="doctor-form">
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="firstName" value={doctor.firstName} onChange={handleChange} placeholder="Enter first name" required />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={doctor.lastName} onChange={handleChange} placeholder="Enter last name" required />
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" name="dob" value={doctor.dob} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={doctor.email} onChange={handleChange} placeholder="Enter email" required />
                    </div>

                    <div className="form-group">
                        <label>Specialization</label>
                        <input type="text" name="specialization" value={doctor.specialization} onChange={handleChange} placeholder="E.g., Cardiologist, Dentist" required />
                    </div>

                    <div className="form-group">
                        <label>License Number</label>
                        <input type="text" name="licenseNumber" value={doctor.licenseNumber} onChange={handleChange} placeholder="Enter license number" required />
                    </div>

                    <div className="form-group">
                        <label>Years of Experience</label>
                        <input type="number" name="experience" value={doctor.experience} onChange={handleChange} placeholder="Enter years of experience" required />
                    </div>

                    {/* Password Field with Eye Icon */}
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={doctor.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="doctor-submit">Register</button>
                </form>
            </div>
        </div>
    );
}
