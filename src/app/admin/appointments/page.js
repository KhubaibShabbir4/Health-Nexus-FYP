'use client';
import { useState, useEffect } from 'react';
import AdminHeader from "../AdminHeader/page.js";
import './page.css';

const API_URL = "/api/auth/appointments"; // ✅ Correct API Path

export default function ManageAppointments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ name: '', date: '', status: 'Pending' });

  // ✅ State for Undo Functionality
  const [deletedAppointment, setDeletedAppointment] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);

  // 📌 Fetch all appointments from the database
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

  const handleEdit = (appointment) => setSelectedAppointment({ ...appointment });

  const handleCloseModal = () => setSelectedAppointment(null);

  const handleStatusChange = (e) =>
    setSelectedAppointment({ ...selectedAppointment, status: e.target.value });

  // 📌 Save Updated Appointment to DB
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
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  // 📌 Handle Appointment Deletion with Undo Feature
  const handleDelete = async () => {
    if (!selectedAppointment) return;

    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await fetch(API_URL, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedAppointment.id }),
        });

        setDeletedAppointment(selectedAppointment);
        setAppointments(appointments.filter(appt => appt.id !== selectedAppointment.id));
        handleCloseModal();

        // Set Undo Timer (5 Minutes)
        const timer = setTimeout(() => {
          setDeletedAppointment(null);
        }, 300000);

        setUndoTimer(timer);
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  // 📌 Undo Deletion
  const handleUndoDelete = async () => {
    if (!deletedAppointment) return;

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deletedAppointment),
      });

      fetchAppointments();
      setDeletedAppointment(null);
      clearTimeout(undoTimer);
    } catch (error) {
      console.error("Error restoring appointment:", error);
    }
  };

  // 📌 Add New Appointment to DB
  const handleAddAppointment = async () => {
    if (!newAppointment.name || !newAppointment.date) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      });

      if (response.ok) {
        fetchAppointments();
        setShowAddModal(false);
        setNewAppointment({ name: '', date: '', status: 'Pending' });
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

        {/* ✅ Floating Undo Button (Now same as ManageAccounts) */}
        {deletedAppointment && (
          <button className="undo-floating-btn" onClick={handleUndoDelete}>
            Undo
          </button>
        )}

        <table className="appointments-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Date</th>
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
            <input
              type="text"
              placeholder="Patient Name"
              value={newAppointment.name}
              onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
            />
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            />
            <button onClick={handleAddAppointment}>Add</button>
            <button onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Appointment</h2>
            <input
              type="text"
              value={selectedAppointment.name}
              onChange={(e) => setSelectedAppointment({ ...selectedAppointment, name: e.target.value })}
            />
            <input
              type="date"
              value={selectedAppointment.date}
              onChange={(e) => setSelectedAppointment({ ...selectedAppointment, date: e.target.value })}
            />
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
