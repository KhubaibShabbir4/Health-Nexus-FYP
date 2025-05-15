import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManageAccounts from '../src/app/admin/manage-accounts/page';  // Correct path
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';

// Mock the router and axios to avoid real navigation and API calls
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('axios');

describe('ManageAccounts', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  it('renders the manage accounts page correctly', () => {
    render(<ManageAccounts />);

    // Check if the form elements and headers are present
    expect(screen.getByText(/manage accounts/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
    expect(screen.getByText(/search by name/i)).toBeInTheDocument();
    expect(screen.getByText(/loading accounts/i)).toBeInTheDocument();
  });

  it('displays accounts after data is fetched', async () => {
    // Mock successful response for fetching accounts
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Patient' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'Admin' },
      ],
    });

    render(<ManageAccounts />);

    // Check if accounts are rendered in the table
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  it('filters accounts based on the search query', async () => {
    // Mock successful response for fetching accounts
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Patient' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'Admin' },
      ],
    });

    render(<ManageAccounts />);

    // Wait for accounts to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    // Simulate searching for 'Jane'
    fireEvent.change(screen.getByPlaceholderText(/search by name/i), {
      target: { value: 'Jane' },
    });

    // Check if the filtered result is correct
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('shows error message when accounts fail to load', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to load accounts'));

    render(<ManageAccounts />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/failed to load accounts/i)).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    // Mock successful response for fetching accounts
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Patient', password: 'password123' },
      ],
    });

    render(<ManageAccounts />);

    // Wait for accounts to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Check initial password field type
    const passwordField = screen.getByPlaceholderText('Enter password');
    expect(passwordField.type).toBe('password');

    // Click to toggle password visibility
    fireEvent.click(screen.getByText('👁️')); // Assuming it's the eye icon to show password
    expect(passwordField.type).toBe('text');
  });

  it('deletes an account successfully', async () => {
    // Mock successful response for fetching accounts
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Patient' },
      ],
    });

    axios.delete.mockResolvedValueOnce({
      data: { message: 'Account deleted successfully' },
    });

    render(<ManageAccounts />);

    // Wait for accounts to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByText('Delete'));

    // Wait for the account to be deleted
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  it('opens and closes the Add Account modal', async () => {
    render(<ManageAccounts />);

    // Check if the add modal is initially not visible
    expect(screen.queryByText(/add new account/i)).not.toBeInTheDocument();

    // Open the modal
    fireEvent.click(screen.getByText('Add Account'));

    // Check if the modal opens
    expect(screen.getByText(/add new account/i)).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByText('Cancel'));

    // Check if the modal closes
    expect(screen.queryByText(/add new account/i)).not.toBeInTheDocument();
  });
});
