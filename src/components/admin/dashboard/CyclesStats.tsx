import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock,
  BarChart2,
  Activity,
  Battery
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CyclesMetrics, 
  CyclesProjection, 
  CyclesUsagePattern 
} from '@/analytics/CyclesMonitor';

interface CyclesStatsProps {
  metrics: CyclesMetrics;
  projection: CyclesProjection;
  pattern: CyclesUsagePattern;
  history: CyclesMetrics[];
}

const formatCycles = (cycles: bigint): string => {
  if (cycles > BigInt(1_000_000_000_000)) {
    return `${(Number(cycles) / 1e12).toFixed(2)}T`;
  }
  if (cycles > BigInt(1_000_000_000)) {
    return `${(Number(cycles) / 1e9).toFixed(2)}B`;
  }
  return `${(Number(cycles) / 1e6).toFixed(2)}M`;
};

const getDaysUntilDepletion = (projection: CyclesProjection): number => {
  if (!projection.projectedDepletion) return Infinity;
  return Math.ceil((projection.projectedDepletion.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

export const CyclesStats: React.FC<CyclesStatsProps> = ({ 
  metrics, 
  projection,
  pattern,
  history 
}) => {
  const daysLeft = getDaysUntilDepletion(projection);
  const needsTopUp = projection.recommendedTopUp > BigInt(0);
  const isLow = metrics.balance < projection.minimumRequired;

  return (
    <div className="space-y-6">
      {/* Critical Alert */}
      {isLow && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center space-x-4"
        >
          <AlertTriangle className="text-red-400" size={24} />
          <div>
            <h3 className="font-semibold text-red-400">Critical Cycles Level</h3>
            <p className="text-gray-400">
              Cycles balance is below minimum required threshold. 
              Recommended top-up: {formatCycles(projection.recommendedTopUp)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`bg-gray-800 rounded-xl p-6 ${
            isLow ? 'border-2 border-red-500/50' : ''
          }`}
        >
          <div className="flex items-center space-x-4">
            <Battery
              className={isLow ? 'text-red-400' : 'text-green-400'}
              size={24}
            />
            <div>
              <h3 className="text-gray-400">Current Balance</h3>
              <p className="text-2xl font-bold">{formatCycles(metrics.balance)}</p>
              <p className="text-sm text-gray-500">
                {daysLeft < Infinity ? `${daysLeft} days remaining` : 'Stable'}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <Activity className="text-blue-400" size={24} />
            <div>
              <h3 className="text-gray-400">Burn Rate</h3>
              <p className="text-2xl font-bold">{formatCycles(projection.burnRate)}</p>
              <p className="text-sm text-gray-500">per day</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <TrendingUp className="text-purple-400" size={24} />
            <div>
              <h3 className="text-gray-400">Peak Usage</h3>
              <p className="text-2xl font-bold">{formatCycles(pattern.peakUsage)}</p>
              <p className="text-sm text-gray-500">in last 24h</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <BarChart2 className="text-yellow-400" size={24} />
            <div>
              <h3 className="text-gray-400">Monthly Projection</h3>
              <p className="text-2xl font-bold">
                {formatCycles(pattern.projectedMonthly)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cycles Balance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={history.map(m => ({
                    timestamp: m.timestamp.getTime(),
                    balance: Number(m.balance) / 1e12
                  }))}
                >
                  <defs>
                    <linearGradient id="cyclesBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
                    stroke="#6B7280" 
                  />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    labelFormatter={(ts) => new Date(ts).toLocaleString()}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#cyclesBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history.map(m => ({
                  timestamp: m.timestamp.getTime(),
                  consumed: Number(m.consumed) / 1e9,
                  refunded: Number(m.refunded) / 1e9
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(ts) => new Date(ts).toLocaleTimeString()}
                    stroke="#6B7280" 
                  />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    labelFormatter={(ts) => new Date(ts).toLocaleString()}
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="consumed" 
                    stroke="#EF4444" 
                    name="Consumed (B)"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="refunded" 
                    stroke="#10B981" 
                    name="Refunded (B)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Allocation Distribution */}
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">
                  Allocation Efficiency
                </h4>
                <TrendingUp className="text-green-400" size={16} />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {(Number(metrics.refunded) / Number(metrics.consumed) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">
                of consumed cycles refunded
              </p>
            </div>

            {/* Usage Stability */}
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">
                  Usage Stability
                </h4>
                <Activity className="text-blue-400" size={16} />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {pattern.spikePeriods.length}
              </p>
              <p className="text-sm text-gray-500">
                anomalies detected today
              </p>
            </div>

            {/* Cycle Health */}
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">
                  Cycle Health
                </h4>
                <AlertTriangle 
                  className={needsTopUp ? 'text-yellow-400' : 'text-green-400'} 
                  size={16} 
                />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {needsTopUp ? 'Top-up Needed' : 'Healthy'}
              </p>
              <p className="text-sm text-gray-500">
                {needsTopUp 
                  ? `Recommended: ${formatCycles(projection.recommendedTopUp)}`
                  : 'Balance sufficient'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};