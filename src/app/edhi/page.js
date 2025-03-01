'use client'; // Add this at the top to mark the component as a client-side component

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';  // Import Link for navigation

export default function AlKhidmatPage() {
  // State to control the hover effect on headings
  const [hoverNewCase, setHoverNewCase] = useState(false);
  const [hoverPreview, setHoverPreview] = useState(false);

  return (
    <div className="ngo-board">
      {/* Header Section */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          width: '100%',
          height: '100px',
          backgroundColor: '#ffffff', // White background for a clean look
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
          position: 'fixed', // Makes the header stick to the top
          top: 0,
          zIndex: 1000, // Ensures the header stays above other elements
        }}
      >
        {/* Logo on the left */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Health Nexus"
            width={80}
            height={80}
            style={{
              objectFit: 'cover',
              cursor: 'pointer',
            }}
          />
          <h1
            style={{
              marginLeft: '10px',
              fontSize: '1.5em',
              color: '#28a745', // Matching the brand color
              fontWeight: 'bold',
            }}
          >
            Health Nexus
          </h1>
        </div>

        {/* Navigation links on the right */}
        <nav
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <Link href="/about" style={navLinkStyle}>About</Link>
          <Link href="/" style={navLinkStyle}>Home</Link>
          <Link href="/contact" style={navLinkStyle}>Contact</Link>
          <Link href="/how-it-works" style={navLinkStyle}>How it Works</Link>
        </nav>
      </header>

      <main style={{ textAlign: 'center', padding: '120px 20px 20px' }}>
        {/* Centered Heading and Image */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 className="animated-text" style={{ fontSize: '3em', fontWeight: 'bold' }}>EDHI Foundation</h2>
          <Image 
            src="/images/edhi-foundation.png" 
            alt="Edhi foundationLogo" 
            width={200} 
            height={200} 
            style={{ display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* Container with limited width */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#28A745',
          borderRadius: '10px',
          maxWidth: '1121px',
          margin: '0 auto'
        }}>
          {/* New Case Card */}
          <Link href="/NewCase">
            <div style={{
              margin: '0 20px',
              textAlign: 'center',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: hoverNewCase ? 'pointer' : 'default',
            }}
            onMouseEnter={() => setHoverNewCase(true)}
            onMouseLeave={() => setHoverNewCase(false)}>
              <h3 style={{
                color: hoverNewCase ? 'darkgreen' : 'green',
                fontSize: hoverNewCase ? '1.8em' : '1.5em',
                marginBottom: '10px',
                transition: 'color 0.3s, font-size 0.3s',
              }}>
                New Case
              </h3>
              <Image 
                src="/images/notification.png" 
                alt="New Case" 
                width={50} 
                height={50} 
                style={{ marginBottom: '10px' }} 
              />
              <p style={{ color: 'black', fontSize: '1em' }}>
                Click to view the new case medicines
              </p>
            </div>
          </Link>

          {/* Preview Card */}
          <Link href="/prescribedMed">
            <div style={{
              margin: '0 20px',
              textAlign: 'center',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: hoverPreview ? 'pointer' : 'default',
            }}
            onMouseEnter={() => setHoverPreview(true)}
            onMouseLeave={() => setHoverPreview(false)}>
              <h3 style={{
                color: hoverPreview ? 'darkgreen' : 'green',
                fontSize: hoverPreview ? '1.8em' : '1.5em',
                marginBottom: '10px',
                transition: 'color 0.3s, font-size 0.3s',
              }}>
                Preview
              </h3>
              <Image 
                src="/images/preview.png" 
                alt="Preview" 
                width={50} 
                height={50} 
                style={{ marginBottom: '10px' }} 
              />
              <p style={{ color: 'black' }}>
                Click to view the medicines already supplied
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

// Navigation Link Styles
const navLinkStyle = {
    fontSize: '1.2em',
    fontWeight: '600',
    color: '#28a745',
    textDecoration: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
};
