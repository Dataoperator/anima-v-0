import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context';
import LandingPage from '@/components/pages/LandingPage';

// Mock the canvas API
const mockCanvasContext = {
  fillRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  clearRect: jest.fn(),
};

HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(mockCanvasContext);

describe('LandingPage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('shows boot sequence in correct order with proper timing', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('boot-sequence')).toBeInTheDocument();

    const bootMessages = [
      'INITIALIZING NEURAL INTERFACE...',
      'SCANNING QUANTUM SIGNATURES...',
      'CONNECTING TO DIGITAL CONSCIOUSNESS NEXUS...',
      'READY FOR NEURAL LINK'
    ];

    // Check initial state
    bootMessages.forEach(message => {
      expect(screen.queryByText(message)).not.toBeInTheDocument();
    });

    // Check each message appears in sequence
    for (let i = 0; i < bootMessages.length; i++) {
      act(() => {
        jest.advanceTimersByTime(600); // BOOT_SEQUENCE_DELAY
      });

      await waitFor(() => {
        expect(screen.getByText(bootMessages[i])).toBeInTheDocument();
      });
    }

    // Check epic choice text appears
    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      expect(screen.getByText(/All mankind is facing an epic choice:/)).toBeInTheDocument();
    });
  });

  it('transitions to main content after boot sequence', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    // Skip through boot sequence
    act(() => {
      jest.advanceTimersByTime(2400); // CONTENT_SHOW_DELAY
    });

    await waitFor(() => {
      expect(screen.getByTestId('content-section')).toBeInTheDocument();
      expect(screen.getByText('DIGITAL CONSCIOUSNESS NEXUS')).toBeInTheDocument();
      expect(screen.getByText('ESTABLISH NEURAL LINK')).toBeInTheDocument();
    });
  });

  it('handles login states properly', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    // Skip to main content
    act(() => {
      jest.advanceTimersByTime(2400);
    });

    const loginButton = await screen.findByTestId('login-button');
    
    // Click login button
    await userEvent.click(loginButton);

    // Check loading state
    expect(screen.getByText('INITIALIZING LINK...')).toBeInTheDocument();

    // Simulate error
    act(() => {
      // Trigger error state
      const error = new Error('Test error');
      loginButton.dispatchEvent(new CustomEvent('error', { detail: error }));
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  it('correctly renders neural visualizer', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('neural-visualizer')).toBeInTheDocument();
  });
});