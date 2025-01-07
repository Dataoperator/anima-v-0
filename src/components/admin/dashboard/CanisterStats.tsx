import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsService, CanisterMetrics } from '@/services/MetricsService';
import { formatBytes, formatNumber } from '@/utils/format';

export const CanisterStats: React.FC = () => {
  const [metrics, setMetrics] = useState<CanisterMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsService = new MetricsService();
        const data = await metricsService.getCanisterMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch canister metrics');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Canister Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Canister Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canister Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Cycles
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {formatNumber(metrics.cycles)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Memory Size
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {formatBytes(metrics.memory_size)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Heap Memory
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {formatBytes(metrics.heap_memory)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Stable Memory
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {formatBytes(metrics.stable_memory)}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Instruction Count
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {formatNumber(metrics.instruction_count)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};