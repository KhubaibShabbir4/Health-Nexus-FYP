'use client';
import { useState } from "react";
import emailjs from 'emailjs-com';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"; // Optional: if you want to use icons
import "./page.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors as the user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};

    // Validate Name
    if (!formData.name.trim()) {
      validationErrors.name = "Name is required!";
    }

    // Validate Email
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required!";
    } else if (!validateEmail(formData.email)) {
      validationErrors.email = "Invalid email format!";
    }

    // Validate Message
    if (!formData.message.trim()) {
      validationErrors.message = "Message is required!";
    } else if (formData.message.length < 10) {
      validationErrors.message = "Message must be at least 10 characters!";
    }

    // Stop submission if there are errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Send email using EmailJS
    emailjs
    .send(
      'service_vj0cdzk',      // Your EmailJS service ID
      'template_9qc4u6d',     // Your EmailJS template ID
      {
        from_name: formData.name,   // Matches {{from_name}} in your template
        from_email: formData.email, // Matches {{from_email}} in your template
        message: formData.message   // Matches {{message}} in your template
      },
      '-rR0UVQiC9eiEYfdS'     // Your EmailJS public key (User ID)
    )
      .then(
        (response) => {
          console.log('Email successfully sent!', response.status, response.text);
          setSuccessMessage("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("Failed to send email via EmailJS:", error);
          setSuccessMessage("Failed to send message. Please try again.");
        }
      );

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="contact-container">
      <div className="contact-card">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">We'd love to hear from you! Fill out the form below.</p>

        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Enter your name" 
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email" 
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Write your message here..."
            />
            {errors.message && <p className="error-message">{errors.message}</p>}
          </div>

          <button type="submit" className="contact-submit">Send Message</button>
        </form>
      </div>

      {/* Optional: Additional contact info */}
      <div className="contact-info">
        <h3>Get in Touch</h3>
        <p><FaEnvelope /> healthnexus22@gmail.com</p>
      </div>
    </div>
  );
}
