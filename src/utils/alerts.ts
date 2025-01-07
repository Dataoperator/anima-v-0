import { Alert, AlertLevel, AlertStatus, AlertHistory } from '@/types/alerts';

export const getAlerts = async (animaId: string): Promise<Alert[]> => {
    try {
        // Implement canister call here
        const response = await window.ic.canister.call(animaId, 'get_system_alerts');
        return response.map(formatAlert);
    } catch (error) {
        console.error('Failed to fetch alerts:', error);
        return [];
    }
};

export const handleAlert = async (alertId: string, action: string): Promise<boolean> => {
    try {
        // Implement canister call here
        await window.ic.canister.call(alertId, 'handle_alert', { action });
        return true;
    } catch (error) {
        console.error('Failed to handle alert:', error);
        return false;
    }
};

export const formatAlert = (rawAlert: any): Alert => {
    return {
        id: rawAlert.id.toString(),
        level: rawAlert.level as AlertLevel,
        message: rawAlert.message,
        timestamp: Number(rawAlert.timestamp),
        details: rawAlert.details || undefined,
        source: rawAlert.source || undefined,
        actions: rawAlert.actions || [],
        metadata: rawAlert.metadata || {}
    };
};

export const generateAlertHistory = (alert: Alert, status: AlertStatus, actor?: string): AlertHistory => {
    return {
        alertId: alert.id,
        status,
        timestamp: Date.now(),
        actor,
        action: status === AlertStatus.RESOLVED ? 'RESOLVE' : 'UPDATE_STATUS'
    };
};

export const categorizeAlerts = (alerts: Alert[]): Record<AlertLevel, Alert[]> => {
    return alerts.reduce((acc, alert) => {
        if (!acc[alert.level]) {
            acc[alert.level] = [];
        }
        acc[alert.level].push(alert);
        return acc;
    }, {} as Record<AlertLevel, Alert[]>);
};

export const filterAlerts = (
    alerts: Alert[],
    level?: AlertLevel,
    since?: Date,
    until?: Date
): Alert[] => {
    return alerts.filter(alert => {
        if (level && alert.level !== level) return false;
        if (since && alert.timestamp < since.getTime()) return false;
        if (until && alert.timestamp > until.getTime()) return false;
        return true;
    });
};

export const sortAlertsByPriority = (alerts: Alert[]): Alert[] => {
    const priorityMap = {
        CRITICAL: 0,
        WARNING: 1,
        INFO: 2
    };

    return [...alerts].sort((a, b) => {
        const priorityDiff = priorityMap[a.level] - priorityMap[b.level];
        if (priorityDiff !== 0) return priorityDiff;
        return b.timestamp - a.timestamp;
    });
};