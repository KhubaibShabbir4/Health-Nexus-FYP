'use client';
import Head from 'next/head';
import Header from '../Header/page'; // Import the Header component
import './page.css';
import { useState } from 'react';

export default function RecentCases() {
  const [cases] = useState([
    {
      caseId: '001',
      patientName: 'John Doe',
      requestedAmount: 1200,
      requestDate: '2024-11-08',
      status: 'New',
      actions: 'Pending',
    },
    {
      caseId: '002',
      patientName: 'Jane Doe',
      requestedAmount: 1000,
      requestDate: '2024-11-07',
      status: 'Pending',
      actions: 'Approve',
    },
    {
      caseId: '003',
      patientName: 'Mark Smith',
      requestedAmount: 2000,
      requestDate: '2024-11-06',
      status: 'Pending',
      actions: 'Approve',
    },
  ]);

  async function saveAllCases() {
    try {
      const response = await fetch('/api/auth/saveCases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cases }),
      });

      if (response.ok) {
        const { skippedCases } = await response.json();
        if (skippedCases.length > 0) {
          alert(`Cases saved successfully! Skipped duplicates: ${skippedCases.join(', ')}`);
        } else {
          alert('Cases saved successfully!');
        }
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        alert('Failed to save cases.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving cases.');
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Health Nexus - Welcome</title>
        <meta name="description" content="Health Nexus NGO Module" />
      </Head>

      <Header />

      <div className="divider" />

      <h1 className="title">Case Summary</h1>

      <button className="save-button" onClick={saveAllCases}>
        Save All Cases
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Patient Name</th>
            <th>Requested Amount</th>
            <th>Request Date</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Gig</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.caseId}>
              <td><a href="/case_detail" className="link">{c.caseId}</a></td>
              <td><a href="/case_detail" className="link">{c.patientName}</a></td>
              <td><a href="/case_detail" className="link">${c.requestedAmount}</a></td>
              <td><a href="/case_detail" className="link">{c.requestDate}</a></td>
              <td><a href="/case_detail" className="link">{c.status}</a></td>
              <td><a href="/case_detail" className="link">{c.actions}</a></td>
              <td>
                <a href="/gig" className="link">Click to View Gig</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
