'use client';
import { useState, useEffect } from 'react';
import AdminHeader from "../AdminHeader/page.js";
import './page.css';

const API_URL = "/api/auth/appointments";

export default function ManageAppointments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ name: '', date: '', time: '', status: 'Pending' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredAppointments = appointments.filter((appointment) =>
    searchBy === 'name'
      ? appointment.name.toLowerCase().includes(searchQuery.toLowerCase())
      : appointment.id.toString().includes(searchQuery)
  );

  const handleEdit = (appointment) => {
    setSelectedAppointment({
      ...appointment,
      date: appointment.date ? appointment.date.split('T')[0] : "",
      time: appointment.time || "00:00",
      status: appointment.status || "Pending",
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setShowEditModal(false);
  };

  const handleStatusChange = (e) =>
    setSelectedAppointment({ ...selectedAppointment, status: e.target.value });

  const handleSave = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedAppointment),
      });

      if (response.ok) {
        fetchAppointments();
        handleCloseModal();
      } else {
        alert("Failed to update appointment.");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await fetch(API_URL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedAppointment.id }),
        });

        fetchAppointments();
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const handleAddAppointment = async () => {
    if (!newAppointment.name || !newAppointment.date || !newAppointment.time) {
      alert("Please fill all fields including time!");
      return;
    }

    const appointmentData = {
      name: newAppointment.name,
      date: newAppointment.date,
      time: newAppointment.time,
      status: newAppointment.status || "Pending",
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        fetchAppointments();
        setShowAddModal(false);
        setNewAppointment({ name: '', date: '', time: '', status: 'Pending' });
      } else {
        alert("Failed to add appointment.");
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="appointments-container">
        <h1>Manage Appointments</h1>

        <div className="search-container">
          <select onChange={(e) => setSearchBy(e.target.value)}>
            <option value="name">Search by Name</option>
            <option value="id">Search by ID</option>
          </select>
          <input type="text" placeholder={`Search by ${searchBy}...`} value={searchQuery} onChange={handleSearch} />
          <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Add Appointment</button>
        </div>

        <table className="appointments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.name}</td>
                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                <td>{appointment.time}</td>
                <td>{appointment.status}</td>
                <td><button className="edit-btn" onClick={() => handleEdit(appointment)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Appointment</h2>
            <input type="text" placeholder="Patient Name" value={newAppointment.name} onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}/>
            <input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}/>
            <input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}/>
            <button onClick={handleAddAppointment}>Add</button>
            <button onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Appointment</h2>
            <input type="text" value={selectedAppointment.name} onChange={(e) => setSelectedAppointment({ ...selectedAppointment, name: e.target.value })}/>
            <input type="date" value={selectedAppointment.date} onChange={(e) => setSelectedAppointment({ ...selectedAppointment, date: e.target.value })}/>
            <input type="time" value={selectedAppointment.time} onChange={(e) => setSelectedAppointment({ ...selectedAppointment, time: e.target.value })}/>
            <select value={selectedAppointment.status} onChange={handleStatusChange}>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleDelete} className="delete-btn">Delete</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
