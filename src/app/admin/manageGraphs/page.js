'use client';
import { useState, useEffect } from "react";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from "chart.js";
import AdminHeader from "../AdminHeader/page"; // ✅ Importing Admin Header
import "./page.css"; // ✅ Importing general CSS

// Registering ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

export default function ManageGraphs() {
  const [chartsData, setChartsData] = useState(null);
  const [selectedChart, setSelectedChart] = useState("Bar Chart");
  const [selectedDataset, setSelectedDataset] = useState("Funds");

  useEffect(() => {
    async function fetchGraphData() {
      try {
        const response = await fetch('/api/auth/getAllGraphData'); // ✅ API that fetches all graph data
        const data = await response.json();
        setChartsData(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    }
    fetchGraphData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutBounce',
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true, stacked: true },
    },
  };

  return (
    <>
      <AdminHeader />

      <div className="graph-container">
        <h1 className="page-title">📊 Manage All Graphs</h1>

        {/* Graph Type & Dataset Selection */}
        <div className="graph-controls">
          <select className="dropdown" onChange={(e) => setSelectedChart(e.target.value)}>
            {["Bar Chart", "Line Chart", "Doughnut Chart", "Pie Chart"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select className="dropdown" onChange={(e) => setSelectedDataset(e.target.value)}>
            {["Funds", "Cases", "Patient Growth", "Appointments"].map((dataset) => (
              <option key={dataset} value={dataset}>{dataset}</option>
            ))}
          </select>
        </div>

        {/* Graph Display */}
        <div className="graph-display">
          {chartsData ? (
            <div className="chart-wrapper">
              {selectedChart === "Bar Chart" && <Bar data={chartsData[selectedDataset]} options={chartOptions} />}
              {selectedChart === "Line Chart" && <Line data={chartsData[selectedDataset]} options={chartOptions} />}
              {selectedChart === "Doughnut Chart" && <Doughnut data={chartsData[selectedDataset]} options={chartOptions} />}
              {selectedChart === "Pie Chart" && <Pie data={chartsData[selectedDataset]} options={chartOptions} />}
            </div>
          ) : (
            <div className="loading">Loading Graph Data...</div>
          )}
        </div>

        {/* Export Options */}
        <div className="export-section">
          <button className="export-btn">📥 Download as CSV</button>
          <button className="export-btn">📷 Save as PNG</button>
        </div>
      </div>

    </>
  );
}
