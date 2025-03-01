'use client';
import { useState } from 'react';
import AdminHeader from "../AdminHeader/page.js";
import './page.css';

export default function ManageAppointments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // Default search by name
  const [appointments, setAppointments] = useState([
    { id: 1, name: 'John Doe', date: '2025-02-15', status: 'Pending' },
    { id: 2, name: 'Jane Smith', date: '2025-02-16', status: 'Confirmed' },
    { id: 3, name: 'Michael Brown', date: '2025-02-17', status: 'Cancelled' }
  ]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ name: '', date: '', status: 'Pending' });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (searchBy === 'name') {
      return appointment.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchBy === 'id') {
      return appointment.id.toString().includes(searchQuery);
    }
    return appointment;
  });

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
  };

  const handleStatusChange = (e) => {
    setSelectedAppointment({ ...selectedAppointment, status: e.target.value });
  };

  const handleSave = () => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === selectedAppointment.id ? selectedAppointment : appt
      )
    );
    handleCloseModal();
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (confirmDelete) {
      setAppointments(appointments.filter(appt => appt.id !== selectedAppointment.id));
      handleCloseModal();
    }
  };

  const handleAddAppointment = () => {
    if (newAppointment.name && newAppointment.date) {
      setAppointments([...appointments, { id: appointments.length + 1, ...newAppointment }]);
      setShowAddModal(false);
      setNewAppointment({ name: '', date: '', status: 'Pending' });
    }
  };

  return (
    <>
      <AdminHeader /> {/* ✅ Added Header Component */}

      <div className="appointments-container">
        <h1>Manage Appointments</h1>

        <div className="search-container">
          <select onChange={(e) => setSearchBy(e.target.value)}>
            <option value="name">Search by Name</option>
            <option value="id">Search by ID</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchBy}...`}
            value={searchQuery}
            onChange={handleSearch}
          />
          <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Add Appointment</button>
        </div>

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
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.name}</td>
                  <td>{appointment.date}</td>
                  <td className={`status ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(appointment)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No appointments found</td>
              </tr>
            )}
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