import React from 'react';  // Import React
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PatientLogin from '../src/app/patient/login/page';  // Correct path
import { useRouter } from 'next/navigation';

// Mock the router so we can test navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the global fetch API to avoid real API calls
global.fetch = jest.fn();

describe('PatientLogin', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  it('renders the login form correctly', () => {
    render(<PatientLogin />);

    // Check if the form elements are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  it('updates email and password fields correctly', () => {
    render(<PatientLogin />);

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Check if the state values are updated correctly
    expect(screen.getByLabelText(/email/i).value).toBe('test@example.com');
    expect(screen.getByLabelText(/password/i).value).toBe('password123');
  });

  it('displays an error message when login fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    render(<PatientLogin />);

    // Simulate form submission
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByText(/log in/i));

    // Wait for error message
    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());
  });

  it('redirects to the patient dashboard on successful login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<PatientLogin />);

    // Simulate form submission with valid credentials
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText(/log in/i));

    // Wait for the success message
    await waitFor(() => expect(screen.getByText(/login successful!/i)).toBeInTheDocument());

    // Check if the router was called for redirection
    expect(mockRouter.push).toHaveBeenCalledWith('/patient');
  });

  it('shows password visibility toggle', () => {
    render(<PatientLogin />);

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByText(/show password/i);

    // Check if the input type is initially password
    expect(passwordInput.type).toBe('password');

    // Click on the toggle button to show the password
    fireEvent.click(toggleButton);

    // Check if the input type changes to text
    expect(passwordInput.type).toBe('text');
  });
});
