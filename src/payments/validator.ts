import { PendingPayment } from './verification_system';

export class PaymentValidator {
    private minAmount: bigint;
    private maxAmount: bigint;
    private timeout: number;

    constructor(minAmount: number, maxAmount: number, timeout: number) {
        this.minAmount = BigInt(minAmount);
        this.maxAmount = BigInt(maxAmount);
        this.timeout = timeout;
    }

    async validate_payment(amount: bigint): Promise<boolean> {
        if (amount < this.minAmount) {
            throw new Error('Payment amount below minimum');
        }

        if (amount > this.maxAmount) {
            throw new Error('Payment amount exceeds maximum');
        }

        return true;
    }

    async validate_completion(payment: PendingPayment): Promise<boolean> {
        const currentTime = Date.now();
        const paymentTime = Number(payment.timestamp);
        const timeDiff = (currentTime - paymentTime) / 1000;

        if (timeDiff > this.timeout) {
            throw new Error('Payment verification timeout');
        }

        return true;
    }
}