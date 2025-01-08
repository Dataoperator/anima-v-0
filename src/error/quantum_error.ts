export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ErrorTracking {
    errorType: string;
    severity: ErrorSeverity;
    context: string;
    error: Error;
    timestamp?: number;
}

export interface ErrorContext {
    operation: string;
    principal?: string;
    params?: Record<string, any>;
}

export class ErrorTracker {
    private static instance: ErrorTracker;
    private errors: ErrorTracking[] = [];
    private readonly MAX_ERRORS = 100;

    private constructor() {}

    static getInstance(): ErrorTracker {
        if (!ErrorTracker.instance) {
            ErrorTracker.instance = new ErrorTracker();
        }
        return ErrorTracker.instance;
    }

    async trackError(error: {
        errorType: string;
        severity: ErrorSeverity;
        context: string | ErrorContext;
        error: Error;
    }): Promise<void> {
        const errorContext = typeof error.context === 'string' 
            ? { operation: error.context }
            : error.context;

        const errorTracking: ErrorTracking = {
            errorType: error.errorType,
            severity: error.severity,
            context: JSON.stringify(errorContext),
            error: error.error,
            timestamp: Date.now()
        };

        this.errors.unshift(errorTracking);

        if (this.errors.length > this.MAX_ERRORS) {
            this.errors = this.errors.slice(0, this.MAX_ERRORS);
        }

        console.error(`[${error.severity}] ${error.errorType}:`, {
            context: errorContext,
            error: error.error
        });
    }

    getRecentErrors(count: number = 10): ErrorTracking[] {
        return this.errors.slice(0, count);
    }

    clearErrors(): void {
        this.errors = [];
    }

    getErrorCount(): number {
        return this.errors.length;
    }
}

export const errorTracker = ErrorTracker.getInstance();