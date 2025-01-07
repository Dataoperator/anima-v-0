import React from 'react';
import { motion } from 'framer-motion';
import { 
  Network, 
  Signal, 
  Wifi, 
  Globe, 
  Clock,
  ArrowUpRight,
  ArrowDownRight 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NetworkMetrics {
  latency: number;
  throughput: number;
  requestCount: number;
  errorRate: number;
  activeConnections: number;
  nodesOnline: number;
  networkLoad: number[];
  responseTimeHistory: { time: number; value: number }[];
}

interface NetworkStatsProps {
  metrics: NetworkMetrics;
}

export const NetworkStats: React.FC<NetworkStatsProps> = ({ metrics }) => {
  const getLatencyStatus = (latency: number) => {
    if (latency < 100) return 'text-green-400';
    if (latency < 300) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <Clock className={getLatencyStatus(metrics.latency)} size={24} />
            <div>
              <h3 className="text-gray-400">Latency</h3>
              <p className="text-2xl font-bold">{metrics.latency}ms</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <Signal className="text-blue-400" size={24} />
            <div>
              <h3 className="text-gray-400">Throughput</h3>
              <p className="text-2xl font-bold">{metrics.throughput}req/s</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <Globe className="text-purple-400" size={24} />
            <div>
              <h3 className="text-gray-400">Nodes Online</h3>
              <p className="text-2xl font-bold">{metrics.nodesOnline}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <Wifi className="text-green-400" size={24} />
            <div>
              <h3 className="text-gray-400">Active Connections</h3>
              <p className="text-2xl font-bold">{metrics.activeConnections}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metrics.networkLoad.map((value, index) => ({
                    timestamp: index,
                    value
                  }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="networkLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timestamp" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#networkLoad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Time History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics.responseTimeHistory}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10B981"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle>Network Status Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
              <ArrowUpRight className="text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Requests/min</p>
                <p className="text-lg font-semibold">{metrics.requestCount}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
              <ArrowDownRight className="text-red-400" />
              <div>
                <p className="text-sm text-gray-400">Error Rate</p>
                <p className="text-lg font-semibold">{metrics.errorRate}%</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
              <Network className="text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Network Health</p>
                <p className="text-lg font-semibold">
                  {metrics.errorRate < 1 ? 'Excellent' : 
                   metrics.errorRate < 5 ? 'Good' : 'Degraded'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};