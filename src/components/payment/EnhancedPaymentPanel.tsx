import React, { useEffect, useState } from 'react';
import { useIC } from '../../hooks/useIC';
import { Principal } from '@dfinity/principal';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PaymentType } from '@/types/payment';

interface EnhancedPaymentPanelProps {
  type: PaymentType;
  onPaymentComplete?: () => void;
  onPaymentError?: (error: string) => void;
}

interface PaymentTransaction {
  id: string;
  amount: bigint;
  timestamp: bigint;
  status: 'pending' | 'completed' | 'failed';
  to: Principal;
  from: Principal;
}

interface ICPBalance {
  e8s: bigint;  // ICP amounts are in e8s (10^-8 ICP)
}

export const EnhancedPaymentPanel: React.FC<EnhancedPaymentPanelProps> = ({
  type,
  onPaymentComplete,
  onPaymentError
}) => {
  const { actor, identity, isAuthenticated } = useIC();
  const [balance, setBalance] = useState<ICPBalance | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalanceAndTransactions = async () => {
      if (!actor || !identity) return;

      try {
        setLoading(true);
        const principal = identity.getPrincipal();
        
        // Fetch balance
        const balanceResult = await actor.get_icp_balance(principal);
        setBalance(balanceResult);

        // Fetch recent transactions
        const transactions = await actor.get_recent_transactions(principal);
        setRecentTransactions(transactions);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching payment data:', err);
        const errorMsg = 'Failed to fetch payment information';
        setError(errorMsg);
        onPaymentError?.(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBalanceAndTransactions();
      // Refresh every 30 seconds
      const interval = setInterval(fetchBalanceAndTransactions, 30000);
      return () => clearInterval(interval);
    }
  }, [actor, identity, isAuthenticated, onPaymentError]);

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
        <CardHeader>
          <CardTitle>Payment System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please connect your Internet Identity to access payment features.</p>
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
      <div className="grid gap-6">
        {/* Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle>ICP Balance</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {balance ? `${formatICP(balance.e8s)} ICP` : 'N/A'}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="flex justify-between items-center p-4 bg-card/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Number(tx.timestamp) / 1000000).toLocaleString()}
                    </p>
                    <p className={tx.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono">{formatICP(tx.amount)} ICP</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      To: {tx.to.toString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <p className="text-center text-muted-foreground">No recent transactions</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};