import { AlertLevel, AlertType, AlertFilter } from '@/types/alerts';
import { ErrorCategory, ErrorSeverity } from '@/services/error-tracker';

export interface Alert {
    id: string;
    level: AlertLevel;
    type: AlertType;
    message: string;
    timestamp: number;
    metadata?: Record<string, any>;
}

export class AlertsMonitor {
    private alerts: Alert[] = [];
    private handlers: Set<(alerts: Alert[]) => void> = new Set();
    private maintenanceMode: boolean = false;

    constructor() {
        this.startMonitoring();
    }

    public addAlert(alert: Omit<Alert, 'id' | 'timestamp'>): void {
        const newAlert: Alert = {
            ...alert,
            id: crypto.randomUUID(),
            timestamp: Date.now()
        };

        this.alerts.push(newAlert);
        this.notifyHandlers();
    }

    public reportError({ category, severity, message, error }: {
        category: ErrorCategory;
        severity: ErrorSeverity;
        message: string;
        error: Error;
    }) {
        this.addAlert({
            level: severity === ErrorSeverity.HIGH ? 'error' : 'warning',
            type: category.toLowerCase() as AlertType,
            message,
            metadata: {
                error: error.message,
                stack: error.stack,
            }
        });
    }

    public getAlerts(filters?: AlertFilter): Alert[] {
        let filtered = [...this.alerts];

        if (!filters) {
            return filtered;
        }

        if (filters.level) {
            filtered = filtered.filter(a => a.level === filters.level);
        }

        if (filters.type) {
            filtered = filtered.filter(a => a.type === filters.type);
        }

        if (filters.since) {
            filtered = filtered.filter(a => a.timestamp >= filters.since);
        }

        return filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    public clearAlerts(olderThan?: number): void {
        if (olderThan) {
            this.alerts = this.alerts.filter(a => a.timestamp > olderThan);
        } else {
            this.alerts = [];
        }
        this.notifyHandlers();
    }

    public subscribe(handler: (alerts: Alert[]) => void): () => void {
        this.handlers.add(handler);
        handler(this.getAlerts());

        return () => {
            this.handlers.delete(handler);
        };
    }

    public getMaintenanceMode(): boolean {
        return this.maintenanceMode;
    }

    public setMaintenanceMode(enabled: boolean): void {
        this.maintenanceMode = enabled;
        if (enabled) {
            this.addAlert({
                level: 'info',
                type: 'system',
                message: 'System entering maintenance mode'
            });
        } else {
            this.addAlert({
                level: 'info',
                type: 'system',
                message: 'System maintenance completed'
            });
        }
    }

    private notifyHandlers(): void {
        const currentAlerts = this.getAlerts();
        this.handlers.forEach(handler => handler(currentAlerts));
    }

    private startMonitoring(): void {
        // Implement alert cleanup logic
        setInterval(() => {
            const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
            this.clearAlerts(oneDayAgo);
        }, 60 * 60 * 1000); // Check every hour
    }
}

// Create and export a singleton instance
export const alertsMonitor = new AlertsMonitor();

export default alertsMonitor;