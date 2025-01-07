import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import { PaymentComponent } from '@/components/payments/PaymentComponent';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { AuthContext } from '@/contexts/AuthContext';
import { mockAuthContext } from '@/mocks/mockAuthContext';
import { LedgerService } from '@/services/ledger';
import { transactionMonitor } from '@/analytics/TransactionMonitor';
import { alertsMonitor } from '@/analytics/AlertsMonitor';
import { PaymentType } from '@/types/payment';

// Mock modules
jest.mock('@dfinity/agent');
jest.mock('@/services/ledger');

// Extend window interface for IC
declare global {
  interface Window {
    ic: any;
  }
}

describe('Payment Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    transactionMonitor.reset();
    alertsMonitor.clearAlerts();
  });

  it('handles successful payment', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <PaymentProvider>
          <PaymentComponent type={PaymentType.Creation} />
        </PaymentProvider>
      </AuthContext.Provider>
    );

    const button = screen.getByText(/Make Payment/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Payment Successful/i)).toBeInTheDocument();
    });
  });

  it('handles insufficient funds', async () => {
    jest.spyOn(LedgerService.prototype, 'getBalance').mockResolvedValue(BigInt(0));

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <PaymentProvider>
          <PaymentComponent type={PaymentType.Creation} />
        </PaymentProvider>
      </AuthContext.Provider>
    );

    const button = screen.getByText(/Make Payment/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Insufficient Balance/i)).toBeInTheDocument();
    });
  });

  it('shows transaction history', async () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <PaymentProvider>
          <PaymentHistory />
        </PaymentProvider>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Creation Payment/i)).toBeInTheDocument();
    });
  });
});