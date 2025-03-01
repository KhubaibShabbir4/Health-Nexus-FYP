import React from 'react';
import Link from 'next/link';
import './page.css'; // Updated CSS below

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="intro-section">
        <h1>Welcome to Health Nexus</h1>
        <p className="sub-text">Streamline healthcare with ease</p>
      </div>
      <div className="login-grid">
        <Link href="/doctor-dashboard">
          <div className="login-card doctor">
            <div className="icon-container">
              <img src="/icons/doctor.png" alt="Doctor Icon" />
            </div>
            <h2>Doctor</h2>
            <p>Manage appointments and patient care.</p>
          </div>
        </Link>
        <Link href="/pharma-dashboard">
          <div className="login-card pharma">
            <div className="icon-container">
              <img src="/icons/pharma.png" alt="Pharma Icon" />
            </div>
            <h2>Pharma Company</h2>
            <p>Monitor medicine stocks and collaborations.</p>
          </div>
        </Link>
        <Link href="/ngo-dashboard">
          <div className="login-card ngo">
            <div className="icon-container">
              <img src="/icons/ngo.png" alt="NGO Icon" />
            </div>
            <h2>NGO</h2>
            <p>Assist patients with financial support.</p>
          </div>
        </Link>
      </div>
      <footer className="footer-section">
        <p>Need help? <Link href="/help">Contact Support</Link></p>
        <p>© 2024 Health Nexus</p>
      </footer>
    </div>
  );
};

export default LoginPage;
