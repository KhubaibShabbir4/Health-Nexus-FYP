import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            {/* Company Column */}
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Services</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Affiliated NGO'S</a></li>
              </ul>
            </div>

            {/* Get Help Column */}
            <div className="footer-col">
              <h4>Get Help</h4>
              <ul>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">Policy</a></li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div className="footer-col">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#"><FaFacebook size={20} className="social-icon" /></a>
                <a href="#"><FaTwitter size={20} className="social-icon" /></a>
                <a href="#"><FaInstagram size={20} className="social-icon" /></a>
                <a href="#"><FaLinkedin size={20} className="social-icon" /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        html, body {
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
          background-color: #24262b;
          padding: 10px 0; /* Reduced padding for a more compact look */
          color: #ffffff;
          text-align: center;
          position: relative;
          left: 0;
          bottom: 0;
        }

        .container {
          width: 100%; /* Increased width to cover the whole page */
          margin: 0 auto;
        }

        .row {
          display: flex;
          justify-content: space-between; /* Spread out columns */
          align-items: center; /* Align content vertically */
          gap: 20px;
        }

        .footer-col {
          flex: 1; /* Evenly distribute columns */
          min-width: 150px; /* Prevent columns from collapsing too much */
        }

        .footer-col h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 10px;
          color: #ffffff;
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-col ul li {
          margin-bottom: 8px;
        }

        .footer-col ul li a {
          text-decoration: none;
          color: #bbbbbb;
          font-size: 0.9rem;
        }

        .footer-col ul li a:hover {
          color: #ffffff;
        }

        .social-links a {
          color: #bbbbbb;
          margin-right: 10px;
          transition: color 0.3s;
        }

        .social-links a:hover {
          color: #ffffff;
        }

        .social-links .social-icon {
          margin-right: 5px;
        }
      `}</style>
    </>
  );
}
