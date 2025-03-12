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
      <div className="partners-wrapper overflow-hidden">
        <div className="partners-container flex animate-scroll">
          {partners.map((partner, index) => (
            <div key={index} className="partner relative w-[200px] h-[100px] mx-8 flex-shrink-0">
              <Image 
                src={partner} 
                alt={`Partner ${index + 1}`} 
                fill
                style={{ objectFit: 'contain' }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
          {/* Duplicate partners to create the continuous loop effect */}
          {partners.map((partner, index) => (
            <div key={`duplicate-${index}`} className="partner relative w-[200px] h-[100px] mx-8 flex-shrink-0">
              <Image 
                src={partner} 
                alt={`Partner ${index + 1}`} 
                fill
                style={{ objectFit: 'contain' }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Partners;
