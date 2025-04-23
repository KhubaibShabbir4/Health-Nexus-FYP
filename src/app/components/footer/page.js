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
          <div className="row">
            {/* Company Column */}
            <div className="footer-col">
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
            <div className="footer-col">
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
            <div className="footer-col">
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
          background-color: #1a1e23; /* Darker background for better contrast */
          padding: 40px 0 30px; /* More top padding, less bottom */
          color: #ffffff;
          text-align: center;
          position: relative;
          left: 0;
          bottom: 0;
          box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1); /* Subtle shadow at the top */
        }

        .container {
          width: 100%;
          max-width: 800px;     /* or whatever your page’s main container is */
          padding: 0 20px;      /* a little side-padding so it doesn’t stick to the edges */
          margin: 0 auto;       /* centers the container */
        }

        .row {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-start;
          gap: 50px; /* Increased gap for better separation between columns */
          flex-wrap: wrap;
        }

        .footer-col {
          flex: 0 0 auto;
          /* width: 160px; */ /* Removed fixed width */
          text-align: center;
        }

        .footer-col h4 {
          font-size: 1.25rem;
          font-weight: 700; /* Bolder headings */
          margin-bottom: 20px;
          color: #4ade80; /* Green color to match the site theme */
          text-align: center;
          position: relative;
          padding-bottom: 10px; /* Space for the underline */
        }

        .footer-col h4::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 50px;
          height: 2px;
          background-color: #4ade80; /* Underline with the same green color */
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .footer-col ul li {
          margin-bottom: 12px;
          width: 100%;
          text-align: center;
        }

        .footer-col ul li a {
          text-decoration: none;
          color: #d1d5db; /* Lighter gray for better readability */
          font-size: 0.95rem;
          transition: all 0.3s ease;
          padding: 2px 0;
        }

        .footer-col ul li a:hover {
          color: #ffffff;
          transform: translateY(-2px); /* Slight upward movement on hover */
        }

        .social-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 5px;
        }

        .social-links a {
          color: #d1d5db;
          background-color: rgba(255, 255, 255, 0.1); /* Subtle background */
          border-radius: 50%;
          width: 36px;
          height: 36px;
          margin: 0 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .social-links a:hover {
          color: #ffffff;
          background-color: #4ade80; /* Green background on hover */
          transform: translateY(-3px); /* Slight upward movement */
          box-shadow: 0 5px 15px rgba(74, 222, 128, 0.4); /* Glow effect */
        }

        .social-links .social-icon {
          font-size: 18px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .container {
            width: 80%;
          }
          
          .row {
            flex-direction: column;
            align-items: center;
            gap: 35px;
          }
          
          .footer-col {
            width: 100%;
            max-width: 220px;
          }
          
          .footer {
            padding: 30px 0 25px;
          }
        }
      `}</style>
    </>
  );
}
