'use client';
import React from 'react';

const ImportantFacts = () => {
  const facts = [
    { icon: "💊", title: "Medicines", description: "Donated medicines to 50k patients." },
    { icon: "🏥", title: "Hospitals", description: "Support over 200 hospitals." },
    { icon: "👩‍⚕️", title: "Volunteers", description: "10k+ healthcare professionals." },
    { icon: "🌍", title: "NGOs", description: "50+ partnered NGOs worldwide." },
  ];

  return (
    <section id="important-facts" className="bg-gray-100 py-8">
      <h2 className="text-center text-3xl font-semibold mb-6 text-green-600">Important Facts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {facts.map((fact, index) => (
          <div key={index} className="fact-card p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="fact-icon text-5xl mb-4 text-green-600">{fact.icon}</div>
            <h3 className="fact-title text-xl font-semibold mb-2">{fact.title}</h3>
            <p className="fact-description text-gray-600">{fact.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImportantFacts;
