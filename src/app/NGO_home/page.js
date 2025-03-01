'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../footer/page';
import Header from '../Header/page'; 

export default function NGOHome() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        alert('Session timed out due to inactivity.');
        router.replace('/NGO_login'); // Replace the current route in history
      }, 60000); // 1 minute in milliseconds
    };

    // Verify user session and set up timer
    const verifyUser = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          router.replace('/NGO_login'); // Replace route in case of invalid session
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        router.replace('/NGO_login');
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
    resetTimer();

    // Reset timer on user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    // Clean up event listeners on unmount
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Health Nexus - Welcome</title>
        <meta name="description" content="Health Nexus NGO Module" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header Component */}
      <Header />

      {/* Welcome Banner */}
      <div className="w-full bg-green-500 text-white py-10 text-center">
        <h1 className="text-4xl font-bold">Welcome to Health Nexus, {user?.email}!</h1>
      </div>

      {/* Main Section */}
      <main className="flex-grow bg-gray-50 p-8 flex flex-col items-center">
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="bg-green-200 p-6 rounded-md shadow-md">
            <p>Total Patients Helped: <strong>100</strong></p>
            <p>Funds Distributed: <strong>100,000</strong></p>
            <p>Pending Requests: <strong>10</strong></p>
            <p>Average Approval Time: <strong>1-2 weeks</strong></p>
          </div>
          <div className="bg-green-200 p-6 rounded-md shadow-md">
            <h3 className="text-lg font-bold">Important Announcements</h3>
            <ul className="list-disc list-inside mt-2">
              <li>Punjab medical store has joined Health Nexus</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-gray-700 max-w-2xl">
          Guided by <strong>compassion</strong> and <strong>respect</strong>, we harness <strong>innovation</strong>, <strong>integrity</strong>, and <strong>dedication</strong> to bridge healthcare gaps, creating a healthier and more supportive world for all in need.
        </p>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
