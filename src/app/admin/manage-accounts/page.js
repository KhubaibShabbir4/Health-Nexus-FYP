'use client';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AdminHeader from "../AdminHeader/page.js";
import './page.css';

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
    const [newAccount, setNewAccount] = useState({ name: '', email: '', password: '', phone: '', role: 'Patient' });

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

    const togglePasswordVisibility = (role, id) => {
        setPasswordVisibility(prevState => ({
            ...prevState,
            [`${role}-${id}`]: !prevState[`${role}-${id}`],
        }));
    };

    // 📌 Handle Account Deletion with Undo Feature
    const handleDeleteAccount = async (id, role) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            try {
                // Send delete request to API
                const response = await fetch(API_URL, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, role }),
                });

                if (response.ok) {
                    setAccounts(accounts.filter(account => !(account.id === id && account.role === role))); // Remove from UI
                } else {
                    console.error("Failed to delete account.");
                }
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
        setSelectedAccount({ ...account });
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
                fetchAccounts();
                setSelectedAccount(null);
            }
        } catch (error) {
            console.error("Error updating account:", error);
        }
    };

    const handleAddAccount = async () => {
        if (!newAccount.name || !newAccount.email || !newAccount.password || !newAccount.role) {
            alert("Please fill in all fields before adding an account.");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAccount),
            });

            if (response.ok) {
                fetchAccounts(); // Refresh UI
                setShowAddModal(false);
                setNewAccount({ name: '', email: '', password: '', phone: '', role: 'Patient' });
            } else {
                console.error("Failed to add account.");
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

                {deletedAccount && <button className="undo-btn" onClick={handleUndoDelete}>Undo Delete</button>}

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
                        {filteredAccounts.map(account => (
                            <tr key={`${account.role}-${account.id}`}>
                                <td>{account.id}</td>
                                <td>{account.name}</td>
                                <td>{account.email}</td>
                                <td className="password-cell">
                                    <span className="password-field">
                                        <input
                                            type={passwordVisibility[`${account.role}-${account.id}`] ? "text" : "password"}
                                            value={account.password}
                                            readOnly
                                        />
                                        <button className="password-toggle-btn" onClick={() => togglePasswordVisibility(account.role, account.id)}>
                                            {passwordVisibility[`${account.role}-${account.id}`] ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </span>
                                </td>
                                <td>{account.phone}</td>
                                <td>{account.role}</td>
                                <td className="actions-cell">
                                    <button className="edit-btn" onClick={() => handleEdit(account)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteAccount(account.id, account.role)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 📌 Add Account Modal */}
            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add Account</h2>
                        <input
                            type="text"
                            placeholder="Full Name"
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
                        <input
                            type="text"
                            placeholder="Phone (Optional)"
                            value={newAccount.phone}
                            onChange={(e) => setNewAccount({ ...newAccount, phone: e.target.value })}
                        />
                        <select value={newAccount.role} onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}>
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                            <option value="NGO">NGO</option>
                            <option value="Pharmacy">Pharmacy</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <button onClick={handleAddAccount}>Add</button>
                        <button onClick={() => setShowAddModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}
