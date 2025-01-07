import React, { useEffect, useState } from 'react';
import { BalanceTracker, BalanceUpdate } from '@/services/balance-tracker';
import { Principal } from '@dfinity/principal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BalanceMonitorProps {
  principal: Principal;
  balanceTracker: BalanceTracker;
}

interface BalanceData {
  timestamp: number;
  balance: number;
}

export const BalanceMonitor: React.FC<BalanceMonitorProps> = ({
  principal,
  balanceTracker
}) => {
  const [balanceHistory, setBalanceHistory] = useState<BalanceData[]>([]);
  const [currentBalance, setCurrentBalance] = useState<bigint>();

  useEffect(() => {
    // Start tracking balance
    balanceTracker.startTracking(principal);

    // Subscribe to updates
    balanceTracker.subscribe(principal, {
      onBalanceUpdate: (update: BalanceUpdate) => {
        setCurrentBalance(update.newBalance);
        setBalanceHistory(prev => [...prev, {
          timestamp: update.timestamp,
          balance: Number(update.newBalance) / 100_000_000
        }]);
      }
    });

    // Get initial balance
    balanceTracker.getLatestBalance(principal).then(balance => {
      setCurrentBalance(balance);
      setBalanceHistory([{
        timestamp: Date.now(),
        balance: Number(balance) / 100_000_000
      }]);
    });

    return () => {
      balanceTracker.stopTracking(principal);
    };
  }, [principal, balanceTracker]);

  const formatBalance = (balance: bigint | undefined): string => {
    if (!balance) return '0';
    return `${Number(balance) / 100_000_000} ICP`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Balance Monitor</h3>
          <div className="text-2xl font-bold text-gray-900">
            {formatBalance(currentBalance)} ICP
          </div>
        </div>

        {/* Balance History Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={balanceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                formatter={(value: number) => [`${value} ICP`, 'Balance']}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Balance Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <dt className="text-sm font-medium text-gray-500">24h Change</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              {balanceHistory.length > 1 ? (
                `${(balanceHistory[balanceHistory.length - 1].balance - balanceHistory[0].balance).toFixed(2)} ICP`
              ) : (
                'N/A'
              )}
            </dd>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <dt className="text-sm font-medium text-gray-500">Updates</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              {balanceHistory.length}
            </dd>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <dt className="text-sm font-medium text-gray-500">Last Update</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              {balanceHistory.length > 0 ? (
                new Date(balanceHistory[balanceHistory.length - 1].timestamp).toLocaleTimeString()
              ) : (
                'N/A'
              )}
            </dd>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => balanceTracker.getLatestBalance(principal)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh Balance
          </button>
        </div>
      </div>
    </div>
  );
};