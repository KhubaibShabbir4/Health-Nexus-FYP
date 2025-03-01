import React from "react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import "./page.css"; // Import Regular CSS

const AdminFooter = () => {
  return (
    <footer className="footer">
      <div className="container">
        
        {/* Left - Copyright */}
        <div className="copyright">
          <p>© {new Date().getFullYear()} Health Nexus. All rights reserved.</p>
        </div>

        {/* Center - Quick Links */}
        <div className="links">
          <a href="/dashboard">Dashboard</a>
          <a href="/users">Users</a>
          <a href="/reports">Reports</a>
          <a href="/settings">Settings</a>
        </div>

        {/* Right - Social Media */}
        <div className="socialIcons">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="icon" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub className="icon" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
