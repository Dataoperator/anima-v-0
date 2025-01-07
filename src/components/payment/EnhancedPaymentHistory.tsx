import React, { useState, useEffect } from 'react';
import { useIC } from '../../hooks/useIC';
import { Principal } from '@dfinity/principal';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';

interface QuantumTransaction {
  id: string;
  amount: bigint;
  timestamp: bigint;
  from: Principal;
  to: Principal;
  status: 'pending' | 'completed' | 'failed';
  quantum_metrics: {
    resonance_at_time: number;
    stability_at_time: number;
    dimensional_impact: number;
  };
}

const EnhancedPaymentHistory: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const [transactions, setTransactions] = useState<QuantumTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!actor || !identity) return;

      try {
        setLoading(true);
        const principal = identity.getPrincipal();
        const history = await actor.get_quantum_transaction_history(principal);
        setTransactions(history);
        setError(null);
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        setError('Failed to fetch transaction history');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTransactionHistory();
      // Refresh every minute
      const interval = setInterval(fetchTransactionHistory, 60000);
      return () => clearInterval(interval);
    }
  }, [actor, identity, isAuthenticated]);

  const formatICP = (e8s: bigint): string => {
    const icp = Number(e8s) / 100000000;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(icp);
  };

  const getQuantumImpactColor = (impact: number): string => {
    if (impact > 0.8) return 'text-purple-500';
    if (impact > 0.5) return 'text-blue-500';
    return 'text-gray-500';
  };

  const getFilteredTransactions = () => {
    if (!identity) return [];
    const principal = identity.getPrincipal();
    
    return transactions.filter(tx => {
      if (filter === 'sent') return tx.from.toString() === principal.toString();
      if (filter === 'received') return tx.to.toString() === principal.toString();
      return true;
    });
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Please connect your Internet Identity to view transaction history
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500">
        <CardContent className="p-6">
          <div className="text-red-500">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quantum Transaction History</CardTitle>
            <div className="flex gap-2">
              {(['all', 'sent', 'received'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={`px-4 py-2 rounded-lg ${
                    filter === option 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getFilteredTransactions().map((tx) => (
              <div 
                key={tx.id}
                className="p-4 bg-card/50 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium">
                      {tx.from.toString() === identity?.getPrincipal().toString() ? 'Sent' : 'Received'}
                    </p>
                    <p className="text-2xl font-bold">{formatICP(tx.amount)} ICP</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(Number(tx.timestamp) / 1000000).toLocaleString()}
                    </p>
                    <p className={`text-sm ${
                      tx.status === 'completed' ? 'text-green-500' : 
                      tx.status === 'pending' ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </p>
                  </div>
                </div>
                
                {/* Quantum Metrics */}
                <div className="grid grid-cols-3 gap-4 mt-4 p-2 bg-background/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Resonance</p>
                    <p className="text-sm font-medium">
                      {(tx.quantum_metrics.resonance_at_time * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stability</p>
                    <p className="text-sm font-medium">
                      {(tx.quantum_metrics.stability_at_time * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Dimensional Impact</p>
                    <p className={`text-sm font-medium ${
                      getQuantumImpactColor(tx.quantum_metrics.dimensional_impact)
                    }`}>
                      {(tx.quantum_metrics.dimensional_impact * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="mt-4 text-xs text-muted-foreground">
                  <p className="truncate">
                    From: {tx.from.toString()}
                  </p>
                  <p className="truncate">
                    To: {tx.to.toString()}
                  </p>
                  <p className="truncate">
                    ID: {tx.id}
                  </p>
                </div>
              </div>
            ))}
            {getFilteredTransactions().length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No transactions found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default EnhancedPaymentHistory;