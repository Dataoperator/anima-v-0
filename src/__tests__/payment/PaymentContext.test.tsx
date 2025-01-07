import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthContext } from '@/contexts/AuthContext';
import { PaymentProvider, usePayment } from '@/contexts/PaymentContext';
import { PaymentType } from '@/types/payment';
import { mockAuthContext, createMockAuthContext } from '@/mocks/mockAuthContext';

const TestComponent = () => {
    const { initiatePayment, paymentInProgress, paymentError } = usePayment();

    return (
        <div>
            <button
                onClick={() => initiatePayment(PaymentType.Creation)}
                disabled={paymentInProgress}
            >
                Make Payment
            </button>
            {paymentError && <div data-testid="error">{paymentError}</div>}
        </div>
    );
};

describe('PaymentContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle successful payment', async () => {
        mockAuthContext.actor.get_payment_amount.mockResolvedValue({ Ok: BigInt(1000000) });
        mockAuthContext.actor.process_payment.mockResolvedValue({ Ok: true });

        render(
            <AuthContext.Provider value={mockAuthContext}>
                <PaymentProvider>
                    <TestComponent />
                </PaymentProvider>
            </AuthContext.Provider>
        );

        const button = screen.getByText('Make Payment');
        await fireEvent.click(button);

        expect(mockAuthContext.actor.get_payment_amount).toHaveBeenCalled();
        expect(mockAuthContext.actor.process_payment).toHaveBeenCalled();
        expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    });

    it('should handle payment error', async () => {
        const errorContext = createMockAuthContext({
            actor: {
                ...mockAuthContext.actor,
                get_payment_amount: jest.fn().mockResolvedValue({ Err: 'Payment failed' }),
            },
        });

        render(
            <AuthContext.Provider value={errorContext}>
                <PaymentProvider>
                    <TestComponent />
                </PaymentProvider>
            </AuthContext.Provider>
        );

        const button = screen.getByText('Make Payment');
        await fireEvent.click(button);

        expect(screen.getByTestId('error')).toHaveTextContent('Payment failed');
    });
});