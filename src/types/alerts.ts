export type AlertLevel = 'info' | 'warning' | 'error' | 'critical';

export type AlertType = 
    | 'system'
    | 'security'
    | 'performance'
    | 'network'
    | 'user'
    | 'payment'
    | 'anima';

export interface AlertFilter {
    level?: AlertLevel;
    type?: AlertType;
    since?: number;
    resolved?: boolean;
}

export interface AlertFilters extends AlertFilter {
    category?: string;
    severity?: string;
    showResolved?: boolean;
}

export interface AlertAction {
    type: string;
    payload?: any;
    metadata?: Record<string, any>;
}

export interface Alert {
    id: string;
    level: AlertLevel;
    type: AlertType;
    message: string;
    timestamp: number;
    resolved?: boolean;
    resolvedBy?: string;
    category?: string;
    severity?: string;
    metadata?: Record<string, any>;
}