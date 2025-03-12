'use client';

import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AdminHeader from "../AdminHeader/page.js";
import './page.css';

// Must match the new file name: manageAccounts.js
const API_URL = "/api/auth/manageAccounts";

export default function ManageAccounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [accounts, setAccounts] = useState([]);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletedAccount, setDeletedAccount] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Patient'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────────
  //                     1. FETCH ALL ACCOUNTS
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // Optional: sort them by role, then name
      const sortedAccounts = data.sort((a, b) => {
        if (a.role !== b.role) return a.role.localeCompare(b.role);
        return a.name.localeCompare(b.name);
      });
      setAccounts(sortedAccounts);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to load accounts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //                     2. SEARCH
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredAccounts = accounts.filter((account) => {
    if (searchBy === 'name') {
      return account.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchBy === 'email') {
      return account.email.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchBy === 'role') {
      return account.role.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });

  // ─────────────────────────────────────────────────────────────────────────────
  //                     3. PASSWORD VISIBILITY
  // ─────────────────────────────────────────────────────────────────────────────
  const togglePasswordVisibility = (role, id) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [`${role}-${id}`]: !prevState[`${role}-${id}`],
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //                     4. DELETE ACCOUNT
  // ─────────────────────────────────────────────────────────────────────────────
  const handleDeleteAccount = async (id, role) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        const response = await fetch(API_URL, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, role }),
        });

        if (response.ok) {
          // Remove from state
          setAccounts((prev) =>
            prev.filter((acc) => !(acc.id === id && acc.role === role))
          );
        } else {
          console.error("Failed to delete account.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  // (Optional) Undo delete logic if you want to "soft delete" – but your server
  // would need to store a "deleted" state instead of actually removing the record
  const handleUndoDelete = async () => {
    // ...
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //                     5. EDIT ACCOUNT
  // ─────────────────────────────────────────────────────────────────────────────
  const handleEdit = (account) => {
    // We do NOT let them edit password or role, so let's store them but not show them
    setSelectedAccount({
      ...account,
      // role is read-only in the edit form
      // password is never shown in the edit form
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedAccount) return;

    try {
      // Send ONLY the fields you want to update
      // For example, name, email, phone, role
      const { id, name, email, phone, role } = selectedAccount;

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, email, phone, role }),
      });

      if (response.ok) {
        fetchAccounts();
        setSelectedAccount(null);
      } else {
        console.error("Failed to update account (check server logs).");
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  //                     6. RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <AdminHeader />

      <div className="accounts-container">
        <h1 className="accounts-title">Manage Accounts</h1>

        {/* Search Controls */}
        <div className="search-container">
          <select onChange={(e) => setSearchBy(e.target.value)}>
            <option value="name">Search by Name</option>
            <option value="email">Search by Email</option>
            <option value="role">Search by Role</option>
          </select>
          <input
            type="text"
            placeholder={`Search by ${searchBy}...`}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Error / Retry */}
        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchAccounts}>Try Again</button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading accounts...</p>
          </div>
        ) : (
          // Table of accounts
          <table className="accounts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={`${account.role}-${account.id}`}>
                  <td>{account.id}</td>
                  <td>{account.name}</td>
                  <td>{account.email}</td>

                  <td className="password-cell">
                    <span className="password-field">
                      <input
                        type={
                          passwordVisibility[`${account.role}-${account.id}`]
                            ? "text"
                            : "password"
                        }
                        value={account.password}
                        readOnly
                      />
                      <button
                        className="password-toggle-btn"
                        onClick={() =>
                          togglePasswordVisibility(account.role, account.id)
                        }
                      >
                        {passwordVisibility[`${account.role}-${account.id}`] ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                    </span>
                  </td>

                  <td>{account.phone}</td>
                  <td>{account.role}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(account)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteAccount(account.id, account.role)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Edit Modal */}
        {selectedAccount && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Account</h2>
              <input
                type="text"
                placeholder="Name"
                value={selectedAccount.name}
                onChange={(e) =>
                  setSelectedAccount({ ...selectedAccount, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={selectedAccount.email}
                onChange={(e) =>
                  setSelectedAccount({ ...selectedAccount, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone"
                value={selectedAccount.phone}
                onChange={(e) =>
                  setSelectedAccount({ ...selectedAccount, phone: e.target.value })
                }
              />
              {/* Role read-only */}
              <input type="text" value={selectedAccount.role} readOnly />

              <div className="modal-buttons">
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={() => setSelectedAccount(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Account Modal */}
        {showAddModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Account</h2>
              <input
                type="text"
                placeholder="Name"
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={newAccount.email}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={newAccount.password}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, password: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone"
                value={newAccount.phone}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, phone: e.target.value })
                }
              />
              <select
                value={newAccount.role}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, role: e.target.value })
                }
              >
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="ngo">NGO</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="Patient">Patient</option>
              </select>
              <div className="modal-buttons">
                <button
                  onClick={() => {
                    // Implement your POST logic if you want to create new accounts
                    setShowAddModal(false);
                  }}
                >
                  Add
                </button>
                <button onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
