import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Bell, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertAction } from '@/types/metrics';

const AlertsMonitor: React.FC = () => {
    const { actor } = useAuth();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 30000);
        return () => clearInterval(interval);
    }, [actor]);

    const fetchAlerts = async () => {
        if (!actor) return;

        try {
            const systemAlerts = await actor.get_system_alerts();
            // Convert backend alerts to frontend format
            const convertedAlerts: Alert[] = systemAlerts.map(alert => ({
                id: alert.id,
                title: alert.title,
                message: alert.message,
                level: alert.severity.toLowerCase() as 'info' | 'warning' | 'error' | 'critical',
                timestamp: Number(alert.timestamp),
                resolved: alert.resolved
            }));
            setAlerts(convertedAlerts);
        } catch (error) {
            console.error('Failed to fetch alerts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (alertId: string, action: AlertAction) => {
        if (!actor) return;

        try {
            await actor.handle_alert_action({
                action_type: action.type,
                payload: action.payload ? { Custom: { data: JSON.stringify(action.payload) } } : { Acknowledge: null }
            });
            
            await fetchAlerts();
        } catch (error) {
            console.error('Failed to handle alert action:', error);
        }
    };

    const getAlertIcon = (level: Alert['level']) => {
        switch (level) {
            case 'critical':
                return <XCircle className="text-red-500" size={24} />;
            case 'error':
                return <AlertTriangle className="text-orange-500" size={24} />;
            case 'warning':
                return <Bell className="text-yellow-500" size={24} />;
            default:
                return <CheckCircle className="text-green-500" size={24} />;
        }
    };

    const getAlertColor = (level: Alert['level']) => {
        switch (level) {
            case 'critical':
                return 'border-red-500 text-red-500';
            case 'error':
                return 'border-orange-500 text-orange-500';
            case 'warning':
                return 'border-yellow-500 text-yellow-500';
            default:
                return 'border-green-500 text-green-500';
        }
    };

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {alerts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No active alerts
                </div>
            ) : (
                alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border-l-4 ${getAlertColor(alert.level)} bg-gray-900/50 rounded-lg overflow-hidden`}
                    >
                        <div className="p-4">
                            <div className="flex items-center gap-3">
                                {getAlertIcon(alert.level)}
                                <div>
                                    <h3 className="font-semibold">
                                        {alert.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {alert.message}
                                    </p>
                                </div>
                            </div>

                            {!alert.resolved && (
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleAction(alert.id, {
                                            type: 'acknowledge',
                                            label: 'Acknowledge',
                                            payload: null
                                        })}
                                        className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded"
                                    >
                                        Acknowledge
                                    </button>
                                    
                                    {alert.level === 'critical' && (
                                        <button
                                            onClick={() => handleAction(alert.id, {
                                                type: 'escalate',
                                                label: 'Escalate',
                                                payload: { priority: 'high' }
                                            })}
                                            className="px-3 py-1 text-sm bg-red-900/50 hover:bg-red-900/75 text-red-500 rounded"
                                        >
                                            Escalate
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
};

export default AlertsMonitor;