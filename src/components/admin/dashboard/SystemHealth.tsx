import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MetricsService } from '@/services/MetricsService';
import { Activity, Server, AlertTriangle } from 'lucide-react';
import type { HealthStatus } from '@/types/metrics';

export const SystemHealth: React.FC = () => {
    const { actor } = useAuth();
    const [health, setHealth] = useState<HealthStatus>('degraded');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHealth = async () => {
            if (!actor) return;

            try {
                const metricsService = new MetricsService(actor);
                const healthData = await metricsService.getHealthStatus();
                setHealth(healthData.status);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch system health');
            } finally {
                setLoading(false);
            }
        };

        fetchHealth();
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, [actor]);

    const getHealthDisplay = () => {
        switch (health) {
            case 'healthy':
                return {
                    icon: <Activity className="h-6 w-6 text-green-500" />,
                    text: 'System Healthy',
                    description: 'All systems operating normally',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/30'
                };
            case 'degraded':
                return {
                    icon: <Server className="h-6 w-6 text-yellow-500" />,
                    text: 'Performance Degraded',
                    description: 'Some systems experiencing issues',
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-500/30'
                };
            case 'critical':
                return {
                    icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
                    text: 'System Critical',
                    description: 'Immediate attention required',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/30'
                };
            default:
                return {
                    icon: <Server className="h-6 w-6 text-gray-500" />,
                    text: 'Status Unknown',
                    description: 'Unable to determine system status',
                    bgColor: 'bg-gray-500/10',
                    borderColor: 'border-gray-500/30'
                };
        }
    };

    const healthDisplay = getHealthDisplay();

    if (loading) {
        return (
            <div className="animate-pulse bg-gray-800/50 rounded-xl p-6">
                <div className="h-6 w-24 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-700 rounded"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <div>
                        <h3 className="font-medium">Error Loading Health Status</h3>
                        <p className="text-sm text-gray-300">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`border rounded-xl p-6 ${healthDisplay.bgColor} ${healthDisplay.borderColor}`}>
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    {healthDisplay.icon}
                </div>
                <div>
                    <h3 className="font-medium text-lg">{healthDisplay.text}</h3>
                    <p className="text-gray-300 text-sm mt-1">
                        {healthDisplay.description}
                    </p>
                </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Last Update</div>
                    <div className="mt-1 text-sm">
                        {new Date().toLocaleTimeString()}
                    </div>
                </div>
                <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Monitoring Status</div>
                    <div className="mt-1 text-sm">Active</div>
                </div>
            </div>
        </div>
    );
};