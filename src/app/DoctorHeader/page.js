"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./page.css"; // Ensure this file includes appropriate styles

function DoctorHeader() {
  return (
    <header className="header">
      <div className="logo-container">
        <Image src="/images/logo.png" alt="Health Nexus" width={80} height={80} />
        <h1 className="title">Health Nexus Doctor</h1>
      </div>

      <nav className="nav">
        <Link href="/about" className="nav-link">About</Link>
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/contact" className="nav-link">Contact</Link>
      </nav>
    </header>
  );
}

export default DoctorHeader;
