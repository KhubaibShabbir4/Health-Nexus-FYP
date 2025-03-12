"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ImportantFacts from "../ImportantFacts/page";
import Partners from "../partners/page";
import Footer from "../footer/page";
import Header from "../Header/page";

// Optional: Keep or adjust this style to suit your design preference
const navLinkStyle = {
  textDecoration: "none",
  color: "#28a745",
  fontSize: "1em",
  fontWeight: "bold",
};

export default function Page() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isVisible, setIsVisible] = useState({
    stats: false,
    mission: false,
    howItWorks: false,
    testimonials: false
  });

  // Add one-time refresh functionality
  useEffect(() => {
    // Check if this is the first visit
    const hasRefreshed = localStorage.getItem('hasRefreshed');
    
    if (!hasRefreshed && typeof window !== 'undefined') {
      // Set the flag in localStorage
      localStorage.setItem('hasRefreshed', 'true');
      
      // Add a small delay before refreshing to ensure localStorage is set
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, []);

  // Animation on scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = {
        stats: document.getElementById('statistics'),
        mission: document.getElementById('mission'),
        howItWorks: document.getElementById('how-it-works'),
        testimonials: document.getElementById('testimonials')
      };
      
      Object.entries(sections).forEach(([key, section]) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          const isInView = rect.top <= window.innerHeight * 0.75;
          setIsVisible(prev => ({ ...prev, [key]: isInView }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount
    setTimeout(handleScroll, 500);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className="ngo-board font-sans min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header Section */}
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/health.jpg"
              alt="Hero Background"
              fill
              priority
              style={{ 
                objectFit: 'cover',
                transform: 'scale(1.1)'
              }}
              quality={95}
              className="z-0 transition-transform duration-10000 animate-slow-zoom"
            />
          </div>
        </div>
        
        {/* Creative Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />
        <div className="absolute inset-0 z-5 opacity-30">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
          </svg>
        </div>

        {/* Hero Text Content with Animation */}
        <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-block mb-4 px-6 py-2 bg-green-600/90 rounded-full text-white text-sm font-semibold tracking-wider transform -rotate-1">
            HEALTHCARE FOR EVERYONE
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg text-white leading-tight">
            <span className="block transform hover:scale-105 transition-transform duration-300">Providing <span className="text-white">Hope</span> &</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 transform hover:scale-105 transition-transform duration-300">Healthcare for All</span>
          </h1>
          <p className="text-lg md:text-2xl mb-10 drop-shadow text-white/90 max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between those who need healthcare assistance
            and organizations that can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="#how-it-works" className="group">
              <button className="w-full relative px-8 py-4 bg-green-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-2xl overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 to-green-600 transition-transform duration-300 transform translate-x-[-100%] group-hover:translate-x-0"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Learn How You Can Help
                  <svg className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </span>
              </button>
            </Link>
            <Link href="/patient/login" className="group">
              <button className="w-full relative px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-2xl overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-white transition-transform duration-300 transform origin-left scale-x-0 group-hover:scale-x-100"></span>
                <span className="relative flex items-center justify-center gap-2 group-hover:text-green-600">
                  Get Started Now
                  <svg className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-20"></div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className={`py-24 relative overflow-hidden ${isVisible.stats ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-green-50 via-green-50/50 to-transparent opacity-50 transform translate-x-1/4"></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 max-w-6xl relative z-10">
          {/* Left Side */}
          <div className="text-center md:text-left max-w-md mb-16 md:mb-0 transform transition-all duration-700" style={{ 
            transform: isVisible.stats ? 'translateX(0)' : 'translateX(-50px)',
            opacity: isVisible.stats ? 1 : 0
          }}>
            <div className="relative group">
              <h2 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400 mb-6 drop-shadow-sm transform transition-transform duration-300 group-hover:scale-105">
                42<span className="text-7xl">%</span>
              </h2>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-50 -z-10 transform transition-transform duration-300 group-hover:scale-110"></div>
            </div>
            <p className="text-xl md:text-2xl text-green-700 leading-relaxed transform transition-all duration-300 hover:translate-x-2">
              of individuals in need in Pakistan have received aid through
              our platform.
            </p>
          </div>

          {/* Right Side */}
          <div className="text-center md:text-left max-w-md transform transition-all duration-700" style={{ 
            transform: isVisible.stats ? 'translateY(0)' : 'translateY(50px)',
            opacity: isVisible.stats ? 1 : 0,
            transitionDelay: '200ms'
          }}>
            <div className="p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-l-4 border-green-500 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <h3 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400 mb-4 relative transform transition-transform duration-300 group-hover:scale-105">
                Health care is expensive but not out of reach.
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed relative transform transition-all duration-300 group-hover:translate-x-2">
                We're working hard to make healthcare accessible for everyone,
                one donation at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className={`py-24 relative ${isVisible.mission ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/30 to-transparent"></div>
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center px-6 max-w-6xl relative z-10">
          {/* Left Side: Mission Text */}
          <div className="text-center md:text-left max-w-md md:mr-16 mb-16 md:mb-0 transform transition-all duration-700" style={{ 
            transform: isVisible.mission ? 'translateY(0)' : 'translateY(50px)',
            opacity: isVisible.mission ? 1 : 0
          }}>
            <div className="inline-block px-4 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-full text-sm font-medium mb-4 transform transition-transform duration-300 hover:scale-105">OUR PURPOSE</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">Mission</span>
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8 transform transition-all duration-300 hover:translate-x-2">
              We are on a mission to connect individuals in need of healthcare
              financial support with reputable organizations, ensuring that
              everyone has access to the care they deserve.
            </p>
            <div className="flex items-center space-x-4 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <p className="text-gray-600 transform transition-all duration-300 group-hover:translate-x-2">Trusted by over 100+ healthcare organizations</p>
            </div>
          </div>

          {/* Right Side: Map or Image */}
          <div className="relative w-full md:w-1/2 h-[400px] flex items-center justify-center transform transition-all duration-700" style={{ 
            transform: isVisible.mission ? 'translateY(0)' : 'translateY(50px)',
            opacity: isVisible.mission ? 1 : 0,
            transitionDelay: '200ms'
          }}>
            <div className="absolute -top-5 -left-5 w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-70 animate-pulse"></div>
            <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-70 animate-float"></div>
            <div className="relative w-full h-full max-w-md shadow-2xl rounded-lg overflow-hidden border border-gray-200 transform transition-transform duration-500 hover:scale-105 group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image
                src="/images/map.png"
                alt="Map"
                fill
                style={{ objectFit: 'contain' }}
                className="p-4 bg-white transform transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`py-24 bg-gradient-to-br from-white to-green-50 relative ${isVisible.howItWorks ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div>
        <div className="container mx-auto px-6 text-center max-w-6xl relative z-10">
          <div className="inline-block px-4 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-full text-sm font-medium mb-4 transform transition-transform duration-300 hover:scale-105">THE PROCESS</div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">It Works</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
            Our simple three-step process connects those in need with the right resources
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200 hidden md:block"></div>
            
            {/* Step Cards */}
            {[
              {
                number: 1,
                title: "Identify the Need",
                description: "Individuals or families in need of healthcare support sign up and verify their needs.",
                image: "/images/step1.jpg",
                delay: 0
              },
              {
                number: 2,
                title: "Connect & Support",
                description: "Our platform matches them with reputable organizations that can help with medical expenses.",
                image: "/images/step2.jpg",
                delay: 200
              },
              {
                number: 3,
                title: "Receive Aid",
                description: "Donations and financial assistance are provided, making life-changing healthcare a reality.",
                image: "/images/step3.jpg",
                delay: 400
              }
            ].map((step, index) => (
              <div key={step.number} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative group z-10" style={{ 
                transform: isVisible.howItWorks ? 'translateY(0)' : 'translateY(50px)',
                opacity: isVisible.howItWorks ? 1 : 0,
                transition: 'all 0.7s ease',
                transitionDelay: `${step.delay}ms`
              }}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl border-4 border-white shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                  {step.number}
                </div>
                <div className="relative w-full h-[220px] mb-6 rounded-lg overflow-hidden group">
                  <Image
                    src={step.image}
                    alt={`Step ${step.number}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400 group-hover:scale-105 transition-transform duration-300">{step.title}</h3>
                <p className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-24 relative ${isVisible.testimonials ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-green-50"></div>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-green-50 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-5"></div>
        <div className="container mx-auto px-6 text-center max-w-6xl relative z-10">
          <div className="inline-block px-4 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-800 rounded-full text-sm font-medium mb-4 transform transition-transform duration-300 hover:scale-105">TESTIMONIALS</div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">Stories</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
            Hear from those who have benefited from our healthcare assistance platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: "Ayesha",
                quote: "I never thought I'd be able to afford the surgery. This platform connected me with an organization that covered most of my expenses.",
                image: "/images/testimonial1.jpg",
                delay: 0
              },
              {
                name: "Malik Family",
                quote: "Thanks to the donors and organizations listed here, we managed to provide essential healthcare to our child.",
                image: "/images/testimonial1.jpg",
                delay: 200
              },
              {
                name: "Talha",
                quote: "The support was incredible. I can't thank the contributors enough for helping me get back on my feet.",
                image: "/images/testimonial1.jpg",
                delay: 400
              }
            ].map((testimonial, index) => (
              <div key={testimonial.name} className="bg-white p-8 rounded-xl shadow-lg transition-all duration-500 transform hover:shadow-2xl hover:-translate-y-2 relative group" style={{ 
                transform: isVisible.testimonials ? 'translateY(0)' : 'translateY(50px)',
                opacity: isVisible.testimonials ? 1 : 0,
                transition: 'all 0.7s ease',
                transitionDelay: `${testimonial.delay}ms`
              }}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-20"></div>
                <div className="flex justify-center mb-6 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-green-50 to-green-100 rounded-full -z-10"></div>
                  <div className="relative h-36 w-36 rounded-full overflow-hidden border-4 border-white shadow-lg z-10 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={testimonial.image}
                      alt={`${testimonial.name}'s testimonial`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transform transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="text-green-600 text-4xl font-serif mb-4 relative">"</div>
                <p className="italic text-gray-600 mb-6 text-lg leading-relaxed relative">
                  {testimonial.quote}
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mb-4"></div>
                <h4 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400 text-xl group-hover:scale-105 transition-transform duration-300">– {testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="pattern-circles-cta" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle-cta" cx="10" cy="10" r="1.6257413380501518" fill="#fff"></circle>
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-cta)"></rect>
          </svg>
        </div>
        
        <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
            Join our platform today and help us create a world where healthcare is accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/patient/login" className="group">
              <button className="w-full relative px-8 py-4 bg-white text-green-600 rounded-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-2xl overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-50 to-white transition-transform duration-300 transform translate-x-[-100%] group-hover:translate-x-0"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Get Started Now
                  <svg className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                  </svg>
                </span>
              </button>
            </Link>
            <Link href="#how-it-works" className="group">
              <button className="w-full relative px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-2xl overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-white/10 transition-transform duration-300 transform origin-left scale-x-0 group-hover:scale-x-100"></span>
                <span className="relative flex items-center justify-center gap-2">
                  Learn More
                  <svg className="w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Important Facts Component */}
      <ImportantFacts />

      {/* Partners Section */}
      <div className="py-16">
        <Partners />
      </div>

      {/* Footer Section */}
      <div className="mt-auto">
        <Footer />
      </div>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-in-out infinite alternate;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
