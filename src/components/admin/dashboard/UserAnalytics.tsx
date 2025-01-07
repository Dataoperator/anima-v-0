import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Clock, 
  Activity,
  TrendingUp,
  UserCheck,
  BarChart2,
  AlertTriangle
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserMetrics, 
  UserBehaviorPattern,
  UserActivity
} from '@/analytics/UserAnalyticsMonitor';

interface UserAnalyticsProps {
  metrics: UserMetrics;
  activities: UserActivity[];
  recentPatterns: UserBehaviorPattern[];
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({ 
  metrics, 
  activities,
  recentPatterns
}) => {
  const activityData = activities
    .reduce((acc, curr) => {
      const date = curr.timestamp.toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(activityData)
    .map(([date, count]) => ({ date, count }));

  const featureUsage = activities
    .reduce((acc, curr) => {
      acc[curr.action] = (acc[curr.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(featureUsage)
    .map(([name, value]) => ({ name, value }));

  const atRiskUsers = recentPatterns
    .filter(p => p.churnRisk === 'High').length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <Users className="text-blue-400" size={24} />
            <div>
              <h3 className="text-gray-400">Total Users</h3>
              <p className="text-2xl font-bold">{metrics.totalUsers}</p>
              <p className="text-sm text-gray-500">
                {metrics.newUsersToday} new today
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <Activity className="text-green-400" size={24} />
            <div>
              <h3 className="text-gray-400">Active Users</h3>
              <p className="text-2xl font-bold">{metrics.activeToday}</p>
              <p className="text-sm text-gray-500">
                {metrics.activeThisWeek} this week
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <Clock className="text-purple-400" size={24} />
            <div>
              <h3 className="text-gray-400">Avg Session</h3>
              <p className="text-2xl font-bold">
                {Math.round(metrics.averageSessionLength)}min
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <UserCheck className="text-yellow-400" size={24} />
            <div>
              <h3 className="text-gray-400">Retention</h3>
              <p className="text-2xl font-bold">
                {metrics.retentionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280" 
                  />
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
                    dataKey="count" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
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
          </CardContent>
        </Card>
      </div>

      {/* User Behavior Insights */}
      <Card>
        <CardHeader>
          <CardTitle>User Behavior Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">
                  At Risk Users
                </h4>
                <AlertTriangle 
                  className={atRiskUsers > 10 ? 'text-red-400' : 'text-yellow-400'} 
                  size={16} 
                />
              </div>
              <p className="mt-2 text-2xl font-bold">{atRiskUsers}</p>
              <p className="text-sm text-gray-500">
                high churn risk
              </p>
            </div>

            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">
                  Popular Time
                </h4>
                <Clock className="text-green-400" size={16} />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {recentPatterns[0]?.mostActiveHours[0]}:00
              </p>
              <p className="text-sm text-gray-500">
                peak activity hour
              </p>
            </div>

            <div className="p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-400">
                  Top Feature
                </h4>
                <BarChart2 className="text-blue-400" size={16} />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {recentPatterns[0]?.popularFeatures[0]?.feature || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                most used feature
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};