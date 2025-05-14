"use client";
import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const scrollToMission = (e) => {
    e.preventDefault();
    const missionSection = document.getElementById('mission');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            {/* Company Column */}
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#mission" onClick={scrollToMission}>About Us</a>
                </li>
                <li>
                  <a href="#">Our Services</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Affiliated NGO'S</a>
                </li>
              </ul>
            </div>

            {/* Get Help Column */}
            <div className="footer-section">
              <h4>Get Help</h4>
              <ul>
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Contact us</a>
                </li>
                <li>
                  <a href="#">Policy</a>
                </li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#">
                  <FaFacebook size={20} className="social-icon" />
                </a>
                <a href="#">
                  <FaTwitter size={20} className="social-icon" />
                </a>
                <a href="#">
                  <FaInstagram size={20} className="social-icon" />
                </a>
                <a href="#">
                  <FaLinkedin size={20} className="social-icon" />
                </a>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>© {new Date().getFullYear()} Last of US. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        html,
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          height: 100%;
        }

        * {
          box-sizing: border-box;
        }

        .footer {
          width: 100%;
          background-color: #1a1e23;
          padding: 40px 0 30px;
          color: #ffffff;
          text-align: center;
          position: relative;
          left: 0;
          bottom: 0;
          box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
        }

        .container {
          width: 100%;
          max-width: 1100px;
          padding: 0 20px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .footer-content {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 60px;
          margin-bottom: 30px;
          width: 100%;
        }

        .footer-section {
          flex: 0 0 auto;
          min-width: 160px;
          max-width: 220px;
          text-align: center;
        }

        .footer-section h4 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #4ade80;
          text-align: center;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-section h4::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 50px;
          height: 2px;
          background-color: #4ade80;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .footer-section ul li {
          margin-bottom: 12px;
          width: 100%;
          text-align: center;
        }

        .footer-section ul li a {
          text-decoration: none;
          color: #d1d5db;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          padding: 2px 0;
        }

        .footer-section ul li a:hover {
          color: #ffffff;
          transform: translateY(-2px);
        }

        .social-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 5px;
          gap: 12px;
        }

        .social-links a {
          color: #d1d5db;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .social-links a:hover {
          color: #ffffff;
          background-color: #4ade80;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4);
        }

        .copyright {
          margin-top: 20px;
          color: #9ca3af;
          font-size: 0.9rem;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }
          
          .footer-section {
            width: 100%;
            max-width: 280px;
          }
          
          .footer {
            padding: 30px 0 25px;
          }
        }
      `}</style>
    </>
  );
}
