import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          {/* First Row: Aligned Headers */}
          <div className="row">
            <div className="footer-col text-center">
              <h4>Company</h4>
            </div>
            <div className="footer-col text-center">
              <h4>Get Help</h4>
            </div>
            <div className="footer-col text-center">
              <h4>Follow Us</h4>
            </div>
          </div>

          {/* Second Row: Links and Social Media */}
          <div className="row">
            {/* Company Column */}
            <div className="footer-col">
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Our Services</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Affiliated NGO'S</a></li>
              </ul>
            </div>

            {/* Get Help Column */}
            <div className="footer-col">
              <ul>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">Policy</a></li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div className="footer-col">
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
  padding: 10px 0;  /* Reduced padding for a smaller height */
  color: #ffffff;
  text-align: center;
  position: relative;
  left: 0;
  bottom: 0;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* First Row: Aligns Company, Get Help, Follow Us in One Line */
.row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  flex-wrap: wrap;
  padding: 5px 0; /* Reduced padding */
}

.footer-col {
  flex: 1;
  min-width: 180px;
}

.footer-col h4 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px; /* Reduced space below heading */
  color: #ffffff;
  text-transform: uppercase;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 3px; /* Adjusted for a thinner underline */
  display: inline-block;
}

/* Second Row: Links and Social Media */
.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  margin-bottom: 5px; /* Reduced space between items */
}

.footer-col ul li a {
  text-decoration: none;
  color: #bbbbbb;
  font-size: 0.85rem; /* Slightly smaller text */
}

.footer-col ul li a:hover {
  color: #ffffff;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 12px; /* Reduced spacing between icons */
}

.social-links a {
  color: #bbbbbb;
  transition: color 0.3s ease-in-out;
}

.social-links a:hover {
  color: #4CAF50;
}

.social-links .social-icon {
  margin-right: 4px;
}

      `}</style>
    </>
  );
}
