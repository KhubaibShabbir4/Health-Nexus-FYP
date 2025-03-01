'use client';
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import "./page.css";

export default function AdminLogin() {
    const router = useRouter(); // Initialize router for navigation

    const [admin, setAdmin] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false); // Toggle Password Visibility

    const handleChange = (e) => {
        setAdmin({ ...admin, [e.target.name]: e.target.value });
        setError({ email: "", password: "" }); // Clear errors when user types
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let errors = {};

        // Email Validation
        if (!admin.email) {
            errors.email = "Email is required!";
        } else if (!validateEmail(admin.email)) {
            errors.email = "Invalid Email!";
        }

        // Password Validation
        if (!admin.password) {
            errors.password = "Password is required!";
        } else if (admin.password.length < 6) {
            errors.password = "Invalid Password!";
        }

        // If errors exist, update state and stop submission
        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }

        console.log("Admin Logged In:", admin);
        alert("Login Successful!");

        // Navigate to Admin Dashboard after successful login
        router.push("/admin/admin-dash");
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Admin Login</h2>
                <p className="login-subtitle">Enter your credentials to access the dashboard</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={admin.email}
                            onChange={handleChange}
                            placeholder="Enter admin email"
                            required
                        />
                        {error.email && <p className="error-message">{error.email}</p>}
                    </div>

                    {/* Password Field with Eye Icon */}
                    <div className="form-group password-group">
                        <label>Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={admin.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {error.password && <p className="error-message">{error.password}</p>}
                    </div>

                    <button type="submit" className="login-submit">Login</button>
                </form>
            </div>
        </div>
    );
}
