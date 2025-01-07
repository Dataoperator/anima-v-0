import React, { useState, useEffect, useCallback } from 'react';
import { useIC } from '../../hooks/useIC';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface PaymentMetrics {
  total_transactions: bigint;
  total_volume: bigint;
  average_processing_time: number;
  success_rate: number;
  quantum_stability: number;
}

interface PaymentAlert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: bigint;
}

const EnhancedPaymentMonitor: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const [metrics, setMetrics] = useState<PaymentMetrics | null>(null);
  const [alerts, setAlerts] = useState<PaymentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTransactions, setActiveTransactions] = useState(0);

  const fetchMetrics = useCallback(async () => {
    if (!actor || !identity) return;

    try {
      const principal = identity.getPrincipal();
      const [metricsData, alertsData, activeCount] = await Promise.all([
        actor.get_payment_metrics(principal),
        actor.get_payment_alerts(principal),
        actor.get_active_transaction_count(principal)
      ]);

      setMetrics(metricsData);
      setAlerts(alertsData);
      setActiveTransactions(Number(activeCount));
      setError(null);
    } catch (err) {
      console.error('Error fetching payment metrics:', err);
      setError('Failed to fetch payment metrics');
    } finally {
      setLoading(false);
    }
  }, [actor, identity]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 10000); // Refresh every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchMetrics]);

  const formatICP = (e8s: bigint): string => {
    const icp = Number(e8s) / 100000000;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(icp);
  };

  const getHealthStatus = (): { status: string; color: string } => {
    if (!metrics) return { status: 'Unknown', color: 'text-gray-500' };
    
    if (metrics.success_rate >= 0.98 && metrics.quantum_stability >= 0.95) {
      return { status: 'Excellent', color: 'text-green-500' };
    } else if (metrics.success_rate >= 0.95 && metrics.quantum_stability >= 0.9) {
      return { status: 'Good', color: 'text-blue-500' };
    } else if (metrics.success_rate >= 0.9 && metrics.quantum_stability >= 0.8) {
      return { status: 'Fair', color: 'text-yellow-500' };
    } else {
      return { status: 'Needs Attention', color: 'text-red-500' };
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Please connect your Internet Identity to monitor payments
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* System Health Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Payment System Health</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            ) : metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={`text-xl font-bold ${getHealthStatus().color}`}>
                    {getHealthStatus().status}
                  </p>
                </div>
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Active Transactions</p>
                  <p className="text-xl font-bold">{activeTransactions}</p>
                </div>
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-xl font-bold">
                    {(metrics.success_rate * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Quantum Stability</p>
                  <p className="text-xl font-bold">
                    {(metrics.quantum_stability * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-xl font-bold">{metrics.total_transactions.toString()}</p>
                </div>
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="text-xl font-bold">{formatICP(metrics.total_volume)} ICP</p>
                </div>
                <div className="p-4 bg-card/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
                  <p className="text-xl font-bold">{metrics.average_processing_time.toFixed(2)}s</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg flex items-start gap-3 ${
                    alert.type === 'error' ? 'bg-red-500/20 text-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}
                >
                  {alert.type === 'error' ? <AlertCircle className="h-5 w-5" /> :
                   alert.type === 'warning' ? <Clock className="h-5 w-5" /> :
                   <CheckCircle2 className="h-5 w-5" />}
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm opacity-80">
                      {new Date(Number(alert.timestamp) / 1000000).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No recent alerts
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedPaymentMonitor;