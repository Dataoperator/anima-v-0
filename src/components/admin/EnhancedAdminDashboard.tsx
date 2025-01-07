import React, { useState, useEffect } from 'react';
import { useIC } from '../../hooks/useIC';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import {
  Activity,
  AlertTriangle,
  Box,
  Cpu,
  Database,
  Users,
  Zap,
  Shield
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface SystemMetrics {
  canister_cycles: bigint;
  memory_usage: number;
  total_transactions: bigint;
  active_users: number;
  error_rate: number;
  quantum_stability: number;
  system_health: number;
  network_latency: number;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: bigint;
  resolved: boolean;
}

interface TimeSeriesData {
  timestamp: number;
  cycles: number;
  memory: number;
  transactions: number;
  users: number;
}

const EnhancedAdminDashboard: React.FC = () => {
  const { actor, identity, isAuthenticated } = useIC();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemData = async () => {
      if (!actor || !identity) return;

      try {
        setLoading(true);
        const principal = identity.getPrincipal();

        // Fetch all system data in parallel
        const [metricsData, alertsData, timeSeriesData] = await Promise.all([
          actor.get_system_metrics(principal),
          actor.get_system_alerts(principal),
          actor.get_metrics_history(principal)
        ]);

        setMetrics(metricsData);
        setAlerts(alertsData);
        setTimeSeriesData(timeSeriesData.map(d => ({
          timestamp: Number(d.timestamp),
          cycles: Number(d.cycles) / 1_000_000_000n, // Convert to billions
          memory: d.memory,
          transactions: Number(d.transactions),
          users: d.users
        })));

        setError(null);
      } catch (err) {
        console.error('Error fetching system data:', err);
        setError('Failed to fetch system data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSystemData();
      const interval = setInterval(fetchSystemData, 30000);
      return () => clearInterval(interval);
    }
  }, [actor, identity, isAuthenticated]);

  const formatCycles = (cycles: bigint): string => {
    return (Number(cycles) / 1_000_000_000).toFixed(2) + 'B';
  };

  const getHealthStatus = () => {
    if (!metrics) return { color: 'gray', status: 'Unknown' };
    const health = metrics.system_health;

    if (health >= 0.9) return { color: 'text-green-500', status: 'Excellent' };
    if (health >= 0.7) return { color: 'text-blue-500', status: 'Good' };
    if (health >= 0.5) return { color: 'text-yellow-500', status: 'Fair' };
    return { color: 'text-red-500', status: 'Critical' };
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Please connect with admin privileges to access dashboard
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metrics && (
                <>
                  <div className={`text-2xl font-bold ${getHealthStatus().color}`}>
                    {getHealthStatus().status}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(metrics.system_health * 100).toFixed(1)}% operational
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canister Cycles</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metrics && (
                <>
                  <div className="text-2xl font-bold">{formatCycles(metrics.canister_cycles)}</div>
                  <div className="text-xs text-muted-foreground">Available cycles</div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metrics && (
                <>
                  <div className="text-2xl font-bold">
                    {(metrics.memory_usage * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of allocated memory
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {metrics && (
                <>
                  <div className="text-2xl font-bold">{metrics.active_users}</div>
                  <div className="text-xs text-muted-foreground">
                    currently connected
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Metrics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>System Metrics Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(75, 85, 99)" />
                  <XAxis 
                    dataKey="timestamp"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    stroke="rgb(156, 163, 175)"
                  />
                  <YAxis stroke="rgb(156, 163, 175)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(31, 41, 55)',
                      border: '1px solid rgb(75, 85, 99)'
                    }}
                    labelStyle={{ color: 'rgb(156, 163, 175)' }}
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cycles" 
                    stroke="rgb(59, 130, 246)" 
                    name="Cycles (B)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="memory" 
                    stroke="rgb(147, 51, 234)" 
                    name="Memory Usage"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="transactions" 
                    stroke="rgb(16, 185, 129)" 
                    name="Transactions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="rgb(236, 72, 153)" 
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No active alerts
                </p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      alert.type === 'error' ? 'bg-red-500/20 text-red-500' :
                      alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm opacity-80">
                        {new Date(Number(alert.timestamp)).toLocaleString()}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <button 
                        className="ml-auto px-2 py-1 rounded-md bg-background/10 hover:bg-background/20"
                        onClick={() => {
                          // Implement alert resolution logic
                        }}
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedAdminDashboard;