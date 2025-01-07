import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Users, Cpu, HardDrive, MessageSquare, Zap, Database, AlertTriangle } from 'lucide-react';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';

export const AdminDashboard = () => {
  const { metrics, history, alerts, loading, error, getMetricsForTimeRange } = useAdminMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Tabs defaultValue="24h" onValueChange={(value) => getMetricsForTimeRange(value)}>
          <TabsList>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={metrics.activeUsers}
          change={metrics.userChange}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          title="CPU Usage"
          value={`${metrics.cpuUsage}%`}
          change={metrics.cpuChange}
          icon={<Cpu className="h-5 w-5" />}
        />
        <MetricCard
          title="Memory Usage"
          value={`${metrics.memoryUsage}%`}
          change={metrics.memoryChange}
          icon={<HardDrive className="h-5 w-5" />}
        />
        <MetricCard
          title="Network Load"
          value={`${metrics.networkLoad} Mb/s`}
          change={metrics.networkChange}
          icon={<Activity className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>CPU, Memory, and Network metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history.system}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU" />
                <Line type="monotone" dataKey="memory" stroke="#8b5cf6" name="Memory" />
                <Line type="monotone" dataKey="network" stroke="#10b981" name="Network" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Active users and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={history.users}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="activeUsers" stroke="#3b82f6" fill="#3b82f680" name="Active Users" />
                <Area type="monotone" dataKey="interactions" stroke="#10b981" fill="#10b98180" name="Interactions" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system alerts and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert key={index} variant={alert.severity}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}% from last period
        </p>
      </CardContent>
    </Card>
  );
};

// Export both named and default for compatibility
export default AdminDashboard;