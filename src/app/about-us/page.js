'use client';
import Image from "next/image";
import "./page.css";
import { FaUsers, FaLightbulb, FaHeart, FaStar, FaHandshake } from "react-icons/fa"; // Import icons

export default function AboutUs() {
    return (
        <div className="about-container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <h1>About Us</h1>
                    <p>We are a passionate team dedicated to innovation, technology, and making a difference in people's lives. Our goal is to create impactful solutions that empower individuals and businesses alike.</p>
                </div>
                <Image
                    src="/images/team.jpg"
                    alt="Teamwork and Innovation"
                    width={500}
                    height={350}
                    className="hero-image"
                />

            </div>

            {/* Who We Are Section */}
            <div className="who-we-are">
                <h2>Who We Are</h2>
                <p>We are a team of problem solvers, innovators, and visionaries committed to delivering exceptional services. Our expertise spans multiple industries, helping businesses and individuals leverage technology for a better future.</p>
            </div>

            {/* Features Section */}
            <div className="features-section">
                <div className="feature-card">
                    <FaUsers className="feature-icon" />
                    <h2>Our Mission</h2>
                    <p>Empowering people through innovative solutions that drive progress and transformation.</p>
                </div>

                <div className="feature-card">
                    <FaLightbulb className="feature-icon" />
                    <h2>Our Vision</h2>
                    <p>To be a global leader in technological innovation, making life simpler, smarter, and more connected.</p>
                </div>

                <div className="feature-card">
                    <FaHeart className="feature-icon" />
                    <h2>Our Values</h2>
                    <p>Commitment, integrity, and passion are the core values that guide everything we do.</p>
                </div>

                <div className="feature-card">
                    <FaStar className="feature-icon" />
                    <h2>Why Choose Us?</h2>
                    <p>We provide top-notch solutions tailored to your needs, ensuring reliability, efficiency, and excellence.</p>
                </div>

                <div className="feature-card">
                    <FaHandshake className="feature-icon" />
                    <h2>Trusted by Many</h2>
                    <p>We have built strong relationships with clients and partners across multiple industries.</p>
                </div>
            </div>

            {/* Our Team Section */}
            <div className="our-team">
                <h2>Meet Our Team</h2>
                <p>Our team consists of highly skilled professionals who are dedicated to delivering exceptional solutions. We believe in teamwork, creativity, and continuous learning to stay ahead in the ever-evolving tech industry.</p>
            </div>
        </div>
    );
}
