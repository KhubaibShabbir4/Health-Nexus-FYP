'use client';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import AdminHeader from "../AdminHeader/page.js";
import './page.css';

export default function ManageAccounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', password: 'Alice@123', role: 'Patient' },
    { id: 2, name: 'Charlie Brown', email: 'charlie@example.com', password: 'Charlie@123', role: 'Doctor' }
  ]);

  const [deletedAccount, setDeletedAccount] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({}); // Track password visibility

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', email: '', password: '', role: 'Patient' });

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const togglePasswordVisibility = (id) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const filteredAccounts = accounts.filter(account => {
    if (searchBy === 'name') {
      return account.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchBy === 'id') {
      return account.id.toString().includes(searchQuery);
    }
    return account;
  });

  const handleDeleteAccount = (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      const accountToDelete = accounts.find(acc => acc.id === id);
      setDeletedAccount(accountToDelete);
      setAccounts(accounts.filter(account => account.id !== id));

      // Set a 5-minute timer for undo option
      const timer = setTimeout(() => {
        setDeletedAccount(null); // Remove backup after 5 minutes
      }, 300000); // 5 minutes = 300000 ms

      setUndoTimer(timer);
    }
  };

  const handleUndoDelete = () => {
    if (deletedAccount) {
      setAccounts([...accounts, deletedAccount]);
      setDeletedAccount(null);
      clearTimeout(undoTimer); // Clear the undo timer
    }
  };

  return (
    <>
      <AdminHeader />

      {/* Manage Accounts Section */}
      <div className="accounts-container">
        <h1 className="accounts-title">Manage Accounts</h1>

        {/* Search & Add Section */}
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
          <button className="add-btn">+ Add Account</button>
        </div>

        {/* Small Floating Undo Button */}
        {deletedAccount && (
          <button className="undo-floating-btn" onClick={handleUndoDelete}>Undo</button>
        )}

        {/* Accounts Table */}
        <table className="accounts-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td className="password-cell">
                  <span className="password-field">
                    <input
                      type={passwordVisibility[account.id] ? "text" : "password"}
                      value={account.password}
                      readOnly
                    />
                    <button className="password-toggle-btn" onClick={() => togglePasswordVisibility(account.id)}>
                      {passwordVisibility[account.id] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </span>
                </td>
                <td>{account.role}</td>
                <td className="actions">
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteAccount(account.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
