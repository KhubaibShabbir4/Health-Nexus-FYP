'use client';
import React from 'react';
import Image from 'next/image';

const Partners = () => {
  const partners = [
    "/images/akhuwat.png",
    "/images/al-khidmat.png",
    "/images/chippa.png",
    "/images/JDC.png",
  ];

  return (
    <section id="partners" className="py-12">
      <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Our Trusted Partners & Clients</h2>
      <div className="partners-wrapper">
        <div className="partners-container">
          {partners.map((partner, index) => (
            <div key={index} className="partner">
              <Image src={partner} alt={`Partner ${index + 1}`} width={200} height={100} />
            </div>
          ))}
          {/* Duplicate partners to create the continuous loop effect */}
          {partners.map((partner, index) => (
            <div key={`duplicate-${index}`} className="partner">
              <Image src={partner} alt={`Partner ${index + 1}`} width={200} height={100} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
