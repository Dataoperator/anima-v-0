import React, { useState, useEffect } from 'react';
import { useIC } from '../../hooks/useIC';
import { Principal } from '@dfinity/principal';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';

interface QuantumEnhancedPayment {
  amount: bigint;
  to: Principal;
  quantum_signature: string;
  resonance_factor: number;
  stability_index: number;
}

interface PaymentState {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
}

const EnhancedICPPaymentPanel: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [paymentState, setPaymentState] = useState<PaymentState>({ status: 'idle' });
  const [quantumMetrics, setQuantumMetrics] = useState({
    resonance: 1.0,
    stability: 1.0,
  });

  useEffect(() => {
    const fetchQuantumMetrics = async () => {
      if (!actor || !identity) return;

      try {
        const principal = identity.getPrincipal();
        const state = await actor.get_quantum_state(principal);
        setQuantumMetrics({
          resonance: state.resonance_factor || 1.0,
          stability: state.stability_index || 1.0,
        });
      } catch (err) {
        console.error('Error fetching quantum metrics:', err);
      }
    };

    if (isAuthenticated) {
      fetchQuantumMetrics();
      const interval = setInterval(fetchQuantumMetrics, 10000);
      return () => clearInterval(interval);
    }
  }, [actor, identity, isAuthenticated]);

  const validateInput = (): string | null => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return 'Please enter a valid amount';
    }
    try {
      Principal.fromText(recipient);
    } catch {
      return 'Please enter a valid recipient address';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!actor || !identity) {
      setPaymentState({ 
        status: 'error', 
        message: 'Please connect your Internet Identity' 
      });
      return;
    }

    const validationError = validateInput();
    if (validationError) {
      setPaymentState({ status: 'error', message: validationError });
      return;
    }

    try {
      setPaymentState({ status: 'processing' });
      
      // Convert ICP to e8s (1 ICP = 10^8 e8s)
      const e8s = BigInt(Math.floor(Number(amount) * 100000000));
      
      // Create quantum-enhanced payment
      const payment: QuantumEnhancedPayment = {
        amount: e8s,
        to: Principal.fromText(recipient),
        quantum_signature: generateQuantumSignature(),
        resonance_factor: quantumMetrics.resonance,
        stability_index: quantumMetrics.stability
      };

      const result = await actor.process_quantum_payment(payment);
      
      if ('Ok' in result) {
        setPaymentState({ 
          status: 'success', 
          message: 'Payment processed successfully' 
        });
        setAmount('');
        setRecipient('');
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentState({ 
        status: 'error', 
        message: err.message || 'Payment failed' 
      });
    }
  };

  const generateQuantumSignature = (): string => {
    // Implement quantum signature generation logic
    const timestamp = Date.now().toString(16);
    const resonanceHex = Math.floor(quantumMetrics.resonance * 255).toString(16);
    const stabilityHex = Math.floor(quantumMetrics.stability * 255).toString(16);
    return `${timestamp}${resonanceHex}${stabilityHex}`;
  };

  return (
    <ErrorBoundary>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quantum-Enhanced ICP Transfer</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Quantum Metrics Display */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Quantum Resonance</p>
              <div className="mt-2 relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary transition-all"
                  style={{ width: `${quantumMetrics.resonance * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-right">
                {(quantumMetrics.resonance * 100).toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Stability Index</p>
              <div className="mt-2 relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all"
                  style={{ width: `${quantumMetrics.stability * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-right">
                {(quantumMetrics.stability * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (ICP)</label>
              <input
                type="number"
                step="0.00000001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="0.00000000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Recipient Principal ID</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="aaaaa-aa..."
              />
            </div>

            {paymentState.message && (
              <div className={`p-4 rounded-lg ${
                paymentState.status === 'error' ? 'bg-red-500/20 text-red-500' :
                paymentState.status === 'success' ? 'bg-green-500/20 text-green-500' :
                'bg-blue-500/20 text-blue-500'
              }`}>
                {paymentState.message}
              </div>
            )}

            <button
              type="submit"
              disabled={paymentState.status === 'processing'}
              className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg 
                       hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentState.status === 'processing' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Send ICP'
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default EnhancedICPPaymentPanel;