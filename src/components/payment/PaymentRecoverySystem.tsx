import React, { useState, useEffect } from 'react';
import { useIC } from '../../hooks/useIC';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { AlertOctagon, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

interface FailedTransaction {
  id: string;
  amount: bigint;
  timestamp: bigint;
  error: string;
  recovery_attempts: number;
  quantum_state: {
    coherence: number;
    stability: number;
  };
}

const PaymentRecoverySystem: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const [failedTransactions, setFailedTransactions] = useState<FailedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFailedTransactions = async () => {
      if (!actor || !identity) return;

      try {
        setLoading(true);
        const principal = identity.getPrincipal();
        const transactions = await actor.get_failed_transactions(principal);
        setFailedTransactions(transactions);
        setError(null);
      } catch (err) {
        console.error('Error fetching failed transactions:', err);
        setError('Failed to fetch transaction recovery data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFailedTransactions();
      const interval = setInterval(fetchFailedTransactions, 30000);
      return () => clearInterval(interval);
    }
  }, [actor, identity, isAuthenticated]);

  const handleRecoveryAttempt = async (transactionId: string) => {
    if (!actor || !identity) return;

    try {
      setProcessing(transactionId);
      const principal = identity.getPrincipal();
      
      // Attempt quantum-stabilized recovery
      const result = await actor.attempt_transaction_recovery({
        transaction_id: transactionId,
        principal,
        quantum_stabilization: true
      });

      if ('Ok' in result) {
        // Remove recovered transaction from list
        setFailedTransactions(prev => 
          prev.filter(tx => tx.id !== transactionId)
        );
      } else {
        throw new Error(result.Err);
      }
    } catch (err) {
      console.error('Recovery attempt failed:', err);
      setError(`Recovery failed: ${err.message}`);
    } finally {
      setProcessing(null);
    }
  };

  const formatICP = (e8s: bigint): string => {
    const icp = Number(e8s) / 100000000;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(icp);
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Please connect your Internet Identity to access payment recovery
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Payment Recovery System
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 flex items-center gap-2 p-4">
              <AlertOctagon className="h-5 w-5" />
              {error}
            </div>
          ) : failedTransactions.length === 0 ? (
            <div className="text-center p-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">All Transactions Healthy</p>
              <p className="text-muted-foreground">No failed transactions to recover</p>
            </div>
          ) : (
            <div className="space-y-4">
              {failedTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 bg-card/50 rounded-lg border border-border/50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Transaction ID
                      </p>
                      <p className="font-mono">{tx.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        Amount
                      </p>
                      <p className="font-bold">{formatICP(tx.amount)} ICP</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Quantum State</p>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Coherence</p>
                          <p className="text-sm font-medium">
                            {(tx.quantum_state.coherence * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Stability</p>
                          <p className="text-sm font-medium">
                            {(tx.quantum_state.stability * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recovery Attempts</p>
                      <p className="text-sm font-medium">{tx.recovery_attempts}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Error Message</p>
                    <p className="text-sm bg-red-500/10 text-red-500 p-2 rounded">
                      {tx.error}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleRecoveryAttempt(tx.id)}
                      disabled={processing === tx.id}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg
                               hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                               flex items-center gap-2"
                    >
                      {processing === tx.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white"></div>
                          Recovering...
                        </>
                      ) : (
                        <>
                          <ArrowRightLeft className="h-4 w-4" />
                          Attempt Recovery
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default PaymentRecoverySystem;