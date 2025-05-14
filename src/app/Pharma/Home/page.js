"use client";
import Link from "next/link";
//import Header from "../../components/Header/page";
import Footer from "../../components/footer/page";
import Header from "../../components/Header/page";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePharma() {
  const handleLogout = () => {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Clear storage
    localStorage.clear();
    sessionStorage.clear();

    // Show message
    toast.success("Logged out successfully");

    // Hard redirect
    window.location.href = "/";
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: `url('/images/phar.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-white/50 z-0"></div>
      <ToastContainer />
      <Header className="relative z-10" />

      <main className="flex flex-col md:flex-row flex-grow items-center justify-around p-4 md:p-12 relative z-10">
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0 md:pr-8">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Partnering for Better Health
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Manage your medication supply chain efficiently. Submit GIGs for needed medications and fulfill orders seamlessly through our dedicated portal.
          </p>
          <p className="text-md text-gray-600">
            Connecting pharmacies with suppliers for a healthier tomorrow.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-black mb-8">
            Welcome Pharma Partner!
          </h2>
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <div className="grid grid-cols-1 gap-6">
              <Link href="/Pharma/SubmitMedicationGigs" className="block">
                <button className="w-full py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300 text-lg">
                  Submit Medication GIGs
                </button>
              </Link>
              <Link href="/Pharma/FulfillMedicationOrders" className="block">
                <button className="w-full py-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition duration-300 text-lg">
                Submitted Gigs Overview
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Controls - Logout Button */}
      <div className="bottom-right-controls">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <style jsx>{`
        .bottom-right-controls {
          position: fixed;
          bottom: 20px;
          right: 80px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
          z-index: 998;
        }
        
        .logout-btn {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 16px 32px;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          width: 180px;
          justify-content: center;
        }
        
        .logout-btn:hover {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(239, 68, 68, 0.4);
        }

        @media (max-width: 768px) {
          .bottom-right-controls {
            gap: 10px;
            right: 20px;
          }
          
          .logout-btn {
            padding: 14px 28px;
            font-size: 1rem;
            width: 160px;
          }
        }
      `}</style>

      {/* <Footer className="relative z-10" />*/}
    </div>
  );
}
