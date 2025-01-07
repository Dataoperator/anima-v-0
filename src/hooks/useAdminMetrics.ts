import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { RealtimeService } from '@/services/RealtimeService';
import type { SystemStats, HealthStatus, HistoryDataPoint, AdminActor } from '@/types/admin';
import type { UpdateType, RealtimeMessage } from '@/types/realtime';

const METRICS_CHANNEL = 'system_metrics';

export const useAdminMetrics = () => {
  const { actor, identity } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [history, setHistory] = useState<HistoryDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeService, setRealtimeService] = useState<RealtimeService | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleMetricsUpdate = useCallback((message: RealtimeMessage) => {
    if (message.type === UpdateType.UPDATE && message.payload) {
      const { system_stats, health_status, history_data } = message.payload;
      
      if (system_stats) {
        setStats(prev => ({
          ...prev,
          ...system_stats
        }));
      }
      
      if (health_status) {
        setHealth(prev => ({
          ...prev,
          ...health_status
        }));
      }
      
      if (history_data) {
        setHistory(prev => [...prev.slice(-99), history_data]);
      }
    }
  }, []);

  const checkAdminStatus = async () => {
    if (!actor || !identity) return;
    
    try {
      const adminActor = actor as unknown as AdminActor;
      const adminStatus = await adminActor.is_admin(identity.getPrincipal());
      setIsAdmin(adminStatus);
    } catch (err) {
      console.error('Failed to check admin status:', err);
      setIsAdmin(false);
    }
  };

  const initializeRealtimeService = useCallback(async () => {
    if (!isAdmin || !actor) return;

    try {
      const host = process.env.NODE_ENV === 'production' 
        ? window.location.hostname 
        : 'localhost';
      
      const service = new RealtimeService(
        `wss://${host}/api/metrics`,
        {
          mode: 'realtime',
          updateInterval: 1000,
          includeQuantumState: true,
          offlineQueueSize: 100,
          retryAttempts: 5
        }
      );

      service.addEventListener(handleMetricsUpdate);
      await service.connect();
      await service.subscribe(METRICS_CHANNEL);
      
      setRealtimeService(service);
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to initialize realtime service:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to metrics service');
      setIsConnected(false);
    }
  }, [isAdmin, actor, handleMetricsUpdate]);

  const fetchMetrics = async () => {
    if (!actor || !isAdmin) return;
    
    try {
      setLoading(true);
      const adminActor = actor as unknown as AdminActor;
      
      const [systemStats, healthStatus, growthHistory] = await Promise.all([
        adminActor.get_system_stats(),
        adminActor.get_health_status(),
        adminActor.get_growth_history()
      ]);

      setStats(systemStats);
      setHealth(healthStatus);
      setHistory(growthHistory);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch admin metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, [actor, identity]);

  useEffect(() => {
    if (isAdmin) {
      fetchMetrics();
      initializeRealtimeService();
    }

    return () => {
      if (realtimeService) {
        realtimeService.disconnect();
        setIsConnected(false);
      }
    };
  }, [isAdmin, initializeRealtimeService]);

  return {
    isAdmin,
    stats,
    health,
    history,
    loading,
    error,
    isConnected,
    refetch: fetchMetrics,
  };
};