import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateAdmin from '../src/app/admin/create-admin/page';  // Correct path 
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react';
import { TestEnvironment } from 'jest-environment-jsdom';

// Mock the router and axios to avoid real navigation and API calls
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('axios');

describe('CreateAdmin', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  it('renders the admin form correctly', () => {
    render(<CreateAdmin />);

    // Check if the form elements are present
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/create admin/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<CreateAdmin />);

    fireEvent.click(screen.getByText(/create admin/i));

    await waitFor(() => {
      expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email format', async () => {
    render(<CreateAdmin />);

    // Simulate entering invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.click(screen.getByText(/create admin/i));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('shows error for password length less than 6 characters', async () => {
    render(<CreateAdmin />);

    // Simulate entering a password that is too short
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123' },
    });

    fireEvent.click(screen.getByText(/create admin/i));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
    });
  });

  it('shows error for future date of birth', async () => {
    render(<CreateAdmin />);

    // Simulate entering a future date for the date of birth
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '2025-12-01' },
    });

    fireEvent.click(screen.getByText(/create admin/i));

    await waitFor(() => {
      expect(screen.getByText(/date of birth must be in the past/i)).toBeInTheDocument();
    });
  });

  it('successfully creates an admin and redirects to login page', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'Admin successfully created!' },
    });

    render(<CreateAdmin />);

    // Simulate filling out the form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/create admin/i));

    await waitFor(() => {
      expect(screen.getByText(/admin successfully created/i)).toBeInTheDocument();
    });

    // Check if the router was called to redirect to the login page
    expect(mockRouter.push).toHaveBeenCalledWith('/admin/AdminLogin');
  });

  it('handles API errors gracefully', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to create admin'));

    render(<CreateAdmin />);

    // Simulate filling out the form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText(/create admin/i));

    await waitFor(() => {
      expect(screen.queryByText(/admin successfully created/i)).not.toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});