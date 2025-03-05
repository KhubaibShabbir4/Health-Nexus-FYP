'use client';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ✅ Restored Eye Icons
import AdminHeader from "../AdminHeader/page.js";
import './page.css';

const API_URL = "/api/auth/manageAccounts"; // ✅ Correct API Path

export default function ManageAccounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', email: '', password: '', role: 'Patient' });
  const [deletedAccount, setDeletedAccount] = useState(null);
  const [undoTimer, setUndoTimer] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({});

  // 📌 Fetch all accounts from database
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredAccounts = accounts.filter(account =>
    searchBy === 'name'
      ? account.name.toLowerCase().includes(searchQuery.toLowerCase())
      : account.id.toString().includes(searchQuery)
  );

  const togglePasswordVisibility = (id) => {
    setPasswordVisibility(prevState => ({ ...prevState, [id]: !prevState[id] }));
  };

  // 📌 Handle Account Deletion with Undo
  const handleDeleteAccount = async (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        const accountToDelete = accounts.find(acc => acc.id === id);
        setDeletedAccount(accountToDelete);
        setAccounts(accounts.filter(account => account.id !== id));

        await fetch(API_URL, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });

        // Set Undo Timer (5 Minutes)
        const timer = setTimeout(() => {
          setDeletedAccount(null);
        }, 300000);

        setUndoTimer(timer);
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleUndoDelete = async () => {
    if (deletedAccount) {
      try {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(deletedAccount),
        });

        fetchAccounts();
        setDeletedAccount(null);
        clearTimeout(undoTimer);
      } catch (error) {
        console.error("Error restoring account:", error);
      }
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount({ ...account }); // ✅ Ensure modal state updates properly
  };

  const handleSaveEdit = async () => {
    if (!selectedAccount) return;

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedAccount),
      });

      if (response.ok) {
        await fetchAccounts(); // ✅ Fetch updated data from DB
        setSelectedAccount(null); // ✅ Close modal after saving
      }
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.name || !newAccount.email || !newAccount.password) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount),
      });

      if (response.ok) {
        await fetchAccounts(); // ✅ Fetch updated data from DB
        setShowAddModal(false);
        setNewAccount({ name: '', email: '', password: '', role: 'Patient' });
      }
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="accounts-container">
        <h1>Manage Accounts</h1>

        <div className="search-container">
          <select onChange={(e) => setSearchBy(e.target.value)}>
            <option value="name">Search by Name</option>
            <option value="id">Search by ID</option>
          </select>
          <input type="text" placeholder={`Search by ${searchBy}...`} value={searchQuery} onChange={handleSearch} />
          <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Add Account</button>
        </div>

        {deletedAccount && <button className="undo-floating-btn" onClick={handleUndoDelete}>Undo</button>}

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
            {filteredAccounts.map(account => (
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
                <td>
                  <button onClick={() => handleEdit(account)}>Edit</button>
                  <button onClick={() => handleDeleteAccount(account.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Account</h2>
            <input
              type="text"
              placeholder="Name"
              value={newAccount.name}
              onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newAccount.email}
              onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={newAccount.password}
              onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
            />
            <select value={newAccount.role} onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="NGO">NGO</option>
              <option value="Pharmacy">Pharmacy</option>
            </select>
            <button onClick={handleAddAccount}>Add</button>
            <button onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {selectedAccount && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Account</h2>
            <input type="text" value={selectedAccount.name} onChange={(e) => setSelectedAccount({ ...selectedAccount, name: e.target.value })} />
            <input type="email" value={selectedAccount.email} onChange={(e) => setSelectedAccount({ ...selectedAccount, email: e.target.value })} />
            <select value={selectedAccount.role} onChange={(e) => setSelectedAccount({ ...selectedAccount, role: e.target.value })}>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="NGO">NGO</option>
              <option value="Pharmacy">Pharmacy</option>
            </select>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setSelectedAccount(null)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}
