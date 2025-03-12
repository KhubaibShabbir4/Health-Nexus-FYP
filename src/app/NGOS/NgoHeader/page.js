"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from './header.module.css';

export default function Header() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect window resize to show/hide mobile menu button
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (dropdownVisible) setDropdownVisible(false);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo - Extreme Left */}
        <div className={styles.logoContainer}>
          <Link href="/" className={styles.logoLink}>
            <div className="relative w-[60px] h-[60px]">
              <Image
                src="/images/logo.png"
                alt="Health Nexus"
                fill
                priority
                style={{ objectFit: 'contain' }}
                className={styles.logo}
              />
            </div>
            <span className={styles.brandName}>Health Nexus</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className={`${styles.mobileMenuButton} ${mobileMenuOpen ? styles.active : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

        {/* Mobile Menu Backdrop */}
        {mobileMenuOpen && <div className={styles.backdrop} onClick={toggleMobileMenu}></div>}

        {/* Navigation Links - Right Side */}
        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.mobileNavActive : ""}`}>
          <div className={styles.navLinks}>
            <Link href="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </Link>
            
            {/* Login Dropdown */}
            <div className={styles.dropdownContainer}>
              <button onClick={toggleDropdown} className={`${styles.navLink} ${styles.loginButton}`}>
                Login
              </button>

              <div className={`${styles.dropdownMenu} ${dropdownVisible ? styles.dropdownVisible : ""}`}>
                <Link href="/patient/login" className={styles.dropdownLink} onClick={() => setMobileMenuOpen(false)}>
                  Patient
                </Link>
                <Link href="/NGO/login" className={styles.dropdownLink} onClick={() => setMobileMenuOpen(false)}>
                  NGO
                </Link>
                <Link href="/Doctor/login" className={styles.dropdownLink} onClick={() => setMobileMenuOpen(false)}>
                  Doctor
                </Link>
                <Link href="/Pharma/Login" className={styles.dropdownLink} onClick={() => setMobileMenuOpen(false)}>
                  Pharma Company
                </Link>
                <Link href="/admin/AdminLogin" className={styles.dropdownLink} onClick={() => setMobileMenuOpen(false)}>
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}