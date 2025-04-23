"use client";
import Link from "next/link";
//import Header from "../../components/Header/page";
import Footer from "../../components/footer/page";
import Header from "../../components/Header/page";

export default function HomePharma() {
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
                  Fulfill Medication Orders
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer className="relative z-10" />*/}
    </div>
  );
}
