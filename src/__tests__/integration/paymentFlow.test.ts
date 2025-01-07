import { Principal } from '@dfinity/principal';
import { LedgerService } from '@/services/ledger';
import { transactionMonitor } from '@/analytics/TransactionMonitor';
import { alertsMonitor } from '@/analytics/AlertsMonitor';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { PaymentType } from '@/types/payment';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { AuthContext } from '@/contexts/AuthContext';
import { mockAuthContext } from '@/mocks/mockAuthContext';

// Mock the actual ICP network calls
jest.mock('@dfinity/agent');

describe('Payment Flow Integration', () => {
    const mockPrincipal = Principal.fromText('2vxsx-fae');
    let ledgerService: LedgerService;
    
    beforeEach(async () => {
        localStorage.clear();
        ledgerService = LedgerService.getInstance();
        await ledgerService.initialize(mockAuthContext.identity);
        
        // Clear all monitoring states
        transactionMonitor.reset();
        alertsMonitor.clearAlerts();
    });

    it('should handle successful payment flow end-to-end', async () => {
        // 1. Setup Payment Component
        const { getByText, queryByText } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <PaymentProvider>
                    <PaymentComponent type={PaymentType.Creation} />
                </PaymentProvider>
            </AuthContext.Provider>
        );

        // 2. Initiate Payment
        fireEvent.click(getByText('Make Payment'));

        // 3. Verify Transaction Started
        await waitFor(() => {
            const pendingTxs = transactionMonitor.getPendingTransactions();
            expect(pendingTxs.length).toBe(1);
            expect(pendingTxs[0].type).toBe('Creation');
        });

        // 4. Verify Alert Creation
        const alerts = alertsMonitor.getAlerts();
        expect(alerts.find(a => a.type === 'payment' && a.level === 'info')).toBeTruthy();

        // 5. Wait for Confirmation
        await waitFor(() => {
            const tx = transactionMonitor.getTransactions()[0];
            expect(tx.status).toBe('Complete');
        });

        // 6. Verify UI Updates
        expect(queryByText('Processing...')).toBeNull();
        expect(getByText('Payment Successful')).toBeInTheDocument();

        // 7. Verify Final System State
        const finalState = await ledgerService.getTransaction(transactionMonitor.getTransactions()[0].id);
        expect(finalState?.status).toBe('confirmed');
    });

    it('should handle network failures with retry mechanism', async () => {
        // 1. Setup network failure scenario
        const mockNetworkError = new Error('Network timeout');
        jest.spyOn(ledgerService, 'transfer').mockRejectedValueOnce(mockNetworkError);

        // 2. Setup Component
        const { getByText } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <PaymentProvider>
                    <PaymentComponent type={PaymentType.Creation} />
                </PaymentProvider>
            </AuthContext.Provider>
        );

        // 3. Initiate Payment
        fireEvent.click(getByText('Make Payment'));

        // 4. Verify Error Handling
        await waitFor(() => {
            const alerts = alertsMonitor.getAlerts();
            expect(alerts.find(a => a.level === 'error')).toBeTruthy();
        });

        // 5. Verify Retry Mechanism
        await waitFor(() => {
            const tx = transactionMonitor.getTransactions()[0];
            expect(tx.retryCount).toBeGreaterThan(0);
        });

        // 6. Verify Error Recovery UI
        expect(getByText('Retry Payment')).toBeInTheDocument();
    });

    it('should handle insufficient funds scenario', async () => {
        // 1. Setup insufficient funds condition
        jest.spyOn(ledgerService, 'getBalance').mockResolvedValue(BigInt(0));

        // 2. Setup Component
        const { getByText } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <PaymentProvider>
                    <PaymentComponent type={PaymentType.Creation} />
                </PaymentProvider>
            </AuthContext.Provider>
        );

        // 3. Attempt Payment
        fireEvent.click(getByText('Make Payment'));

        // 4. Verify Error State
        await waitFor(() => {
            const alerts = alertsMonitor.getAlerts();
            const errorAlert = alerts.find(a => 
                a.level === 'error' && 
                a.message.includes('Insufficient funds')
            );
            expect(errorAlert).toBeTruthy();
        });

        // 5. Verify Transaction Record
        const tx = transactionMonitor.getTransactions()[0];
        expect(tx.status).toBe('Failed');
        expect(tx.error).toContain('Insufficient funds');

        // 6. Verify UI Updates
        expect(getByText('Insufficient Balance')).toBeInTheDocument();
    });

    it('should track multiple concurrent transactions', async () => {
        // 1. Setup Multiple Payments
        const { getByTestId } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <PaymentProvider>
                    <div>
                        <PaymentComponent type={PaymentType.Creation} data-testid="payment-1" />
                        <PaymentComponent type={PaymentType.Growth} data-testid="payment-2" />
                    </div>
                </PaymentProvider>
            </AuthContext.Provider>
        );

        // 2. Initiate Multiple Payments
        fireEvent.click(getByTestId('payment-1'));
        fireEvent.click(getByTestId('payment-2'));

        // 3. Verify Concurrent Processing
        await waitFor(() => {
            const pendingTxs = transactionMonitor.getPendingTransactions();
            expect(pendingTxs.length).toBe(2);
        });

        // 4. Verify Independent Processing
        await waitFor(() => {
            const txs = transactionMonitor.getTransactions();
            expect(txs.every(tx => tx.status === 'Complete')).toBe(true);
            expect(txs[0].id).not.toBe(txs[1].id);
        });

        // 5. Verify System Metrics
        const metrics = transactionMonitor.getMetrics();
        expect(metrics.totalTransactions).toBe(2);
        expect(metrics.successRate).toBe(100);
    });

    it('should persist transaction state across sessions', async () => {
        // 1. Create Initial Transaction
        const { unmount } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <PaymentProvider>
                    <PaymentComponent type={PaymentType.Creation} />
                </PaymentProvider>
            </AuthContext.Provider>
        );

        // 2. Complete Transaction
        await waitFor(() => {
            const tx = transactionMonitor.getTransactions()[0];
            expect(tx.status).toBe('Complete');
        });

        // 3. Unmount and Clear Runtime State
        unmount();
        transactionMonitor.reset();

        // 4. Create New Session
        const { getByText } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <PaymentProvider>
                    <PaymentHistory />
                </PaymentProvider>
            </AuthContext.Provider>
        );

        // 5. Verify State Persistence
        await waitFor(() => {
            const displayedTx = getByText(/Creation Payment/);
            expect(displayedTx).toBeInTheDocument();
        });

        // 6. Verify Metrics Persistence
        const metrics = transactionMonitor.getMetrics();
        expect(metrics.totalTransactions).toBe(1);
    });
});