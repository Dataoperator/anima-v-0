import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, AlertCircle, Activity } from 'lucide-react';
import { SecurityMetrics } from '@/analytics/SecurityMonitor';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

interface SecurityPanelProps {
  metrics: SecurityMetrics | null;
}

export const SecurityPanel: React.FC<SecurityPanelProps> = ({ metrics }) => {
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);

  if (!metrics) {
    return (
      <div className="text-center text-gray-400">
        Loading security metrics...
      </div>
    );
  }

  const threatData = metrics.topThreats.map((threat, index) => ({
    name: threat,
    value: metrics.criticalEvents - index * 5 // Sample threat weight
  }));

  const eventDistribution = [
    { name: 'Critical', value: metrics.criticalEvents, color: '#EF4444' },
    { name: 'Warning', value: metrics.warningEvents, color: '#F59E0B' },
    { name: 'Info', value: metrics.totalEvents - metrics.criticalEvents - metrics.warningEvents, color: '#3B82F6' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl p-6 border border-red-500/20"
        >
          <div className="flex items-center space-x-4">
            <AlertCircle className="text-red-400" size={24} />
            <div>
              <h3 className="text-red-400">Critical Events</h3>
              <p className="text-2xl font-bold">{metrics.criticalEvents}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-xl p-6 border border-yellow-500/20"
        >
          <div className="flex items-center space-x-4">
            <AlertTriangle className="text-yellow-400" size={24} />
            <div>
              <h3 className="text-yellow-400">Warnings</h3>
              <p className="text-2xl font-bold">{metrics.warningEvents}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20"
        >
          <div className="flex items-center space-x-4">
            <Shield className="text-blue-400" size={24} />
            <div>
              <h3 className="text-blue-400">Active Defenses</h3>
              <p className="text-2xl font-bold">{metrics.activeDefenses.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20"
        >
          <div className="flex items-center space-x-4">
            <Activity className="text-green-400" size={24} />
            <div>
              <h3 className="text-green-400">Detection Rate</h3>
              <p className="text-2xl font-bold">98.2%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Distribution */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold mb-6">Event Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Threats */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-xl font-bold mb-6">Top Threats</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Active Defenses */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-xl font-bold mb-6">Active Defense Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.activeDefenses.map((defense, index) => (
            <motion.div
              key={defense}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-3"
            >
              <Shield className="text-green-400" size={20} />
              <span>{defense}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Latest Alerts */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-xl font-bold mb-6">Latest Security Alerts</h3>
        <div className="space-y-4">
          {/* Sample alerts - replace with real data */}
          {[
            { type: 'critical', message: 'Unusual transaction pattern detected', time: '2 min ago' },
            { type: 'warning', message: 'Rate limit threshold reached', time: '5 min ago' },
            { type: 'info', message: 'New security patch available', time: '15 min ago' },
          ].map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg flex items-center justify-between ${
                alert.type === 'critical' 
                  ? 'bg-red-500/10 border border-red-500/20' 
                  : alert.type === 'warning'
                  ? 'bg-yellow-500/10 border border-yellow-500/20'
                  : 'bg-blue-500/10 border border-blue-500/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                {alert.type === 'critical' ? (
                  <AlertCircle className="text-red-400" size={20} />
                ) : alert.type === 'warning' ? (
                  <AlertTriangle className="text-yellow-400" size={20} />
                ) : (
                  <Activity className="text-blue-400" size={20} />
                )}
                <span>{alert.message}</span>
              </div>
              <span className="text-sm text-gray-400">{alert.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};