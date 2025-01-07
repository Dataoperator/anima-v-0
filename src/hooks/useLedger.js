import { useState, useCallback } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { useAuth } from './useAuth';

// ICP ledger canister ID
const LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';
const ICP_COST = BigInt(100000000); // 1 ICP = 100000000 e8s

export const useLedger = () => {
  const { identity } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const createPaymentLink = useCallback(async () => {
    if (!identity) {
      throw new Error('Not authenticated');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const principal = identity.getPrincipal();
      const subaccount = []; // Default subaccount
      const paymentId = Date.now().toString();

      // Format for QR code or deep link
      const paymentLink = {
        id: paymentId,
        amount: ICP_COST,
        to: LEDGER_CANISTER_ID,
        from: principal.toText(),
        subaccount,
      };

      return paymentLink;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [identity]);

  const verifyPayment = useCallback(async (paymentId) => {
    if (!identity) {
      throw new Error('Not authenticated');
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Connect to the ledger canister
      const agent = new HttpAgent({ identity });
      const ledgerActor = Actor.createActor('ledger', {
        agent,
        canisterId: Principal.fromText(LEDGER_CANISTER_ID),
      });

      // Query the transaction by payment ID
      const result = await ledgerActor.verify_payment({
        payment_id: paymentId,
        expected_amount: ICP_COST,
      });

      return result.verified;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [identity]);

  return {
    createPaymentLink,
    verifyPayment,
    isProcessing,
    error,
  };
};