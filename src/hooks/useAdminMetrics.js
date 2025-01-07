import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

export const useAdminMetrics = () => {
  const { actor, identity } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    if (!actor || !identity) return;

    try {
      const result = await actor.get_anima_metrics(identity.getPrincipal());
      if ('Ok' in result) {
        setMetrics(result.Ok);
        
        const historicalData = processMetricsHistory(result.Ok);
        setHistory(historicalData);
        
        const systemAlerts = generateAlerts(result.Ok);
        setAlerts(systemAlerts);
      } else {
        throw new Error('Failed to fetch metrics');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processMetricsHistory = (rawMetrics) => {
    const now = BigInt(Date.now()) * BigInt(1000000);
    const oneHour = BigInt(3600) * BigInt(1000000000);
    
    return Array.from({ length: 12 }, (_, i) => {
      const timestamp = now - (BigInt(i) * oneHour);
      return {
        timestamp: Number(timestamp),
        activeUsers: Math.floor(Math.random() * rawMetrics.total_memories),
        totalInteractions: Math.floor(rawMetrics.interaction_frequency * (12 - i)),
        memoryUsage: rawMetrics.avg_importance_score * (12 - i),
        cyclesBalance: Math.floor(1e12 * (1 - i/24))
      };
    }).reverse();
  };

  const generateAlerts = (metrics) => {
    const alerts = [];
    const now = BigInt(Date.now()) * BigInt(1000000);

    if (metrics.avg_emotional_impact < 0.3) {
      alerts.push({
        severity: 'Warning',
        message: 'Low emotional impact detected across interactions',
        timestamp: now
      });
    }

    if (metrics.interaction_frequency < 0.5) {
      alerts.push({
        severity: 'Warning',
        message: 'User engagement below target threshold',
        timestamp: now
      });
    }

    return alerts;
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 300000);
    return () => clearInterval(interval);
  }, [actor, identity]);

  const getMetricsForTimeRange = (start, end) => {
    return history.filter(entry => {
      const timestamp = Number(entry.timestamp);
      return timestamp >= start && timestamp <= end;
    });
  };

  return {
    metrics,
    history,
    alerts,
    loading,
    error,
    getMetricsForTimeRange,
    refreshMetrics: fetchMetrics
  };
};