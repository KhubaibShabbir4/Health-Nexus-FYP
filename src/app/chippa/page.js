'use client'; // Mark the component as a client-side component

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation
import Footer from "../footer/page";

export default function AlKhidmatPage() {
  // State to control the hover effect on headings
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div className="ngo-board">
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          width: '100%',
          height: '100px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
              color: '#28a745',
              fontWeight: 'bold',
            }}
          >
            Health Nexus
          </h1>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link href="/about" style={navLinkStyle}>About</Link>
          <Link href="/" style={navLinkStyle}>Home</Link>
          <Link href="/contact" style={navLinkStyle}>Contact</Link>
          <Link href="/how-it-works" style={navLinkStyle}>How it Works</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ textAlign: 'center', padding: '120px 20px 20px' }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 className="animated-text" style={{ fontSize: '3em', fontWeight: 'bold' }}>CHIPPA Foundation</h2>
          <Image
            src="/images/chippa.png"
            alt="Chippa"
            width={200}
            height={200}
            style={{ display: 'block', margin: '0 auto' }}
          />
        </div>

        {/* Buttons Container */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#28A745',
            borderRadius: '10px',
            maxWidth: '1121px',
            margin: '0 auto',
          }}
        >
          {[
            {
              title: 'New Case',
              description: 'Click to view the new case medicines',
              href: '/NewCase',
              imageSrc: '/images/notification.png',
            },
            {
              title: 'Preview',
              description: 'Click to view the medicines already supplied',
              href: '/prescribedMed',
              imageSrc: '/images/preview.png',
            },
          ].map((item, index) => (
            <Link href={item.href} key={index}>
              <div
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{
                  width: '250px',
                  height: '300px',
                  textAlign: 'center',
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer',
                  boxShadow: hoverIndex === index ? '0 4px 8px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transform: hoverIndex === index ? 'scale(1.05)' : 'none',
                }}
              >
                <h3
                  style={{
                    color: 'green',
                    fontSize: '1.5em',
                    marginBottom: '10px',
                    transition: 'color 0.3s, font-size 0.3s',
                  }}
                >
                  {item.title}
                </h3>
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  width={50}
                  height={50}
                  style={{ marginBottom: '10px' }}
                />
                <p style={{ color: 'black', fontSize: '1em' }}>
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}


const navLinkStyle = {
  fontSize: '1.2em',
  fontWeight: '600',
  color: '#28a745',
  textDecoration: 'none',
  padding: '10px 15px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
};
