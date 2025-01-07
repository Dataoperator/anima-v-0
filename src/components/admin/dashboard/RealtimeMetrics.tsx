import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  chart?: boolean;
  data?: any[];
  color?: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  chart,
  data,
  color = 'blue',
  subtitle
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800 rounded-xl p-6 border border-gray-700"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {typeof change !== 'undefined' && (
        <div
          className={`px-2 py-1 rounded text-sm ${
            change >= 0
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {change >= 0 ? '+' : ''}{change}%
        </div>
      )}
    </div>

    {chart && data && (
      <div className="h-24 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
            <XAxis 
              dataKey="name" 
              stroke="#718096"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#718096"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A202C',
                border: '1px solid #2D3748',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: '#A0AEC0' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={`var(--color-${color}-500)`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </motion.div>
);

interface RealtimeMetricsProps {
  metrics: any;
}

export const RealtimeMetrics: React.FC<RealtimeMetricsProps> = ({ metrics }) => {
  // Sample time series data
  const generateTimeSeriesData = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      name: `${i}m`,
      value: Math.floor(Math.random() * 100)
    }));
  };

  return (
    <>
      <MetricCard
        title="Active Users"
        value={metrics.users?.active_users || 0}
        change={12}
        chart
        data={generateTimeSeriesData(10)}
        color="blue"
        subtitle="Last 24 hours"
      />

      <MetricCard
        title="Network Health"
        value={metrics.network?.status || 'Unknown'}
        color="green"
        subtitle={`Latency: ${metrics.network?.latency || 0}ms`}
      />

      <MetricCard
        title="Security Events"
        value={metrics.security?.totalEvents || 0}
        change={-5}
        chart
        data={generateTimeSeriesData(10)}
        color="red"
      />

      <MetricCard
        title="Memory Usage"
        value={`${(metrics.system?.memory_usage_percent || 0).toFixed(2)}%`}
        chart
        data={generateTimeSeriesData(10)}
        color="purple"
      />

      <MetricCard
        title="Total Transactions"
        value={metrics.system?.total_transactions?.toString() || '0'}
        change={8}
        color="indigo"
        subtitle="All time"
      />

      <MetricCard
        title="Cycles Balance"
        value={formatCycles(metrics.canisters?.cycles_balance || 0)}
        chart
        data={generateTimeSeriesData(10)}
        color="yellow"
      />
    </>
  );
};

function formatCycles(cycles: bigint): string {
  const trillion = BigInt(1_000_000_000_000);
  if (cycles >= trillion) {
    return `${(Number(cycles) / Number(trillion)).toFixed(2)}T`;
  }
  const billion = BigInt(1_000_000_000);
  if (cycles >= billion) {
    return `${(Number(cycles) / Number(billion)).toFixed(2)}B`;
  }
  const million = BigInt(1_000_000);
  if (cycles >= million) {
    return `${(Number(cycles) / Number(million)).toFixed(2)}M`;
  }
  return cycles.toString();
}