import { useState, useCallback } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { useAuth } from './useAuth';

// Types
interface PaymentLink {
  id: string;
  amount: bigint;
  to: string;
  from: string;
  subaccount: number[];
}

interface PaymentError {
  code: number;
  message: string;
  details?: unknown;
}

interface PaymentVerification {
  payment_id: string;
  expected_amount: bigint;
}

// Constants
const LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const ICP_COST = BigInt(100000000); // 1 ICP = 100000000 e8s

export const useLedger = () => {
  const { identity } = useAuth();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<PaymentError | null>(null);

  const createPaymentLink = useCallback(async (): Promise<PaymentLink> => {
    if (!identity) {
      throw new Error('Not authenticated');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const principal = identity.getPrincipal();
      const subaccount: number[] = []; // Default subaccount
      const paymentId = Date.now().toString();

      const paymentLink: PaymentLink = {
        id: paymentId,
        amount: ICP_COST,
        to: LEDGER_CANISTER_ID,
        from: principal.toText(),
        subaccount,
      };

      return paymentLink;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError({
        code: 500,
        message: error.message,
        details: err
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [identity]);

  const verifyPayment = useCallback(async (paymentId: string): Promise<boolean> => {
    if (!identity) {
      throw new Error('Not authenticated');
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Connect to the ledger canister
      const agent = new HttpAgent({ identity });
      await agent.fetchRootKey(); // Required when not in production

      const ledgerActor = Actor.createActor<any>('ledger', {
        agent,
        canisterId: Principal.fromText(LEDGER_CANISTER_ID),
      });

      // Query the transaction by payment ID
      const verification: PaymentVerification = {
        payment_id: paymentId,
        expected_amount: ICP_COST,
      };

      const result = await ledgerActor.verify_payment(verification);
      return result.verified;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError({
        code: 500,
        message: error.message,
        details: err
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [identity]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createPaymentLink,
    verifyPayment,
    isProcessing,
    error,
    clearError,
  };
};