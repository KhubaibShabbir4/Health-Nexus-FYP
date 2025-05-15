import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../src/app/appointments/page'; // Correct path to the Appointment Page component
import React from 'react';

// Mocking the global fetch API for the appointments endpoint
global.fetch = jest.fn();

describe('AppointmentPage', () => {
  beforeEach(() => {
    // Reset the mock before each test
    fetch.mockClear();
  });

  it('renders the appointments page correctly', () => {
    render(<Page />);

    // Check if the page header is rendered
    expect(screen.getByText('Appointments')).toBeInTheDocument();
  });

  it('fetches and displays appointments successfully', async () => {
    const mockAppointments = [
      {
        id: 1,
        name: 'John Doe',
        date: '2025-05-20',
        time: '10:00 AM',
        status: 'accepted',
        reason: 'Follow-up visit',
        user_id: 101,
      },
    ];

    // Mock the fetch response for successful appointment data
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAppointments,
    });

    render(<Page />);

    // Wait for the appointments to load
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());
    expect(screen.getByText('Follow-up visit')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
  });

  it('handles error when fetching appointments fails', async () => {
    // Mock the fetch response for failed API call
    fetch.mockRejectedValueOnce(new Error('Failed to fetch appointments'));

    render(<Page />);

    // Wait for error handling to complete
    await waitFor(() => expect(screen.getByText('No appointments found.')).toBeInTheDocument());
  });

  it('handles the case when no appointments are found', async () => {
    // Mock the fetch response for no appointments
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Page />);

    // Check if the "No appointments found" message is displayed
    await waitFor(() => expect(screen.getByText('No appointments found.')).toBeInTheDocument());
  });

  it('displays prescription link for completed appointments', async () => {
    const mockAppointments = [
      {
        id: 1,
        name: 'John Doe',
        date: '2025-05-20',
        time: '10:00 AM',
        status: 'completed',
        reason: 'Check-up',
        user_id: 101,
      },
    ];

    // Mock the fetch response with completed appointments
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAppointments,
    });

    render(<Page />);

    // Check if the prescription link is displayed
    await waitFor(() => expect(screen.getByText('View Prescription')).toBeInTheDocument());
  });
});
