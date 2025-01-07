import { useEffect } from 'react';

export enum ErrorCategory {
  Network = 'NETWORK',
  Authentication = 'AUTHENTICATION',
  Authorization = 'AUTHORIZATION',
  Validation = 'VALIDATION',
  Business = 'BUSINESS',
  Technical = 'TECHNICAL',
  Security = 'SECURITY',
  Quantum = 'QUANTUM'
}

export enum ErrorSeverity {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Medium = 'MEDIUM',
  Low = 'LOW',
  Info = 'INFO'
}

export interface ErrorEvent {
  type: string;
  category?: ErrorCategory;
  severity?: ErrorSeverity;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  stackTrace?: string;
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorEvent[] = [];
  private readonly MAX_ERRORS = 100;
  private listeners: ((error: ErrorEvent) => void)[] = [];

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private setupGlobalHandlers() {
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'UnhandledPromiseRejection',
        category: ErrorCategory.Technical,
        severity: ErrorSeverity.High,
        message: event.reason?.message || 'Unknown Promise Error',
        timestamp: new Date(),
        context: {
          reason: event.reason
        }
      });
    });

    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'GlobalError',
        category: ErrorCategory.Technical,
        severity: ErrorSeverity.Critical,
        message: event.message,
        timestamp: new Date(),
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        stackTrace: event.error?.stack
      });
    });
  }

  trackError(error: ErrorEvent) {
    const enhancedError = {
      ...error,
      context: {
        ...error.context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    };

    this.errors = [enhancedError, ...this.errors].slice(0, this.MAX_ERRORS);
    this.notifyListeners(enhancedError);
    this.persistErrors();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Tracked Error:', enhancedError);
    }
  }

  private notifyListeners(error: ErrorEvent) {
    this.listeners.forEach(listener => listener(error));
  }

  addListener(listener: (error: ErrorEvent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private persistErrors() {
    try {
      localStorage.setItem('anima_error_log', JSON.stringify(this.errors));
    } catch (e) {
      console.warn('Failed to persist errors:', e);
    }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
    this.persistErrors();
  }

  getErrorSummary() {
    const summary = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errors.length,
      byType: summary,
      mostRecent: this.errors[0],
      mostCommonType: Object.entries(summary)
        .sort(([,a], [,b]) => b - a)[0]?.[0]
    };
  }
}

export const errorTracker = ErrorTracker.getInstance();

// React hook for error tracking
export const useErrorTracking = (options: {
  onError?: (error: ErrorEvent) => void;
} = {}) => {
  useEffect(() => {
    const removeListener = options.onError
      ? errorTracker.addListener(options.onError)
      : undefined;

    return () => removeListener?.();
  }, [options.onError]);

  return {
    trackError: (error: Omit<ErrorEvent, 'timestamp'>) => {
      errorTracker.trackError({
        ...error,
        timestamp: new Date()
      });
    },
    getErrorSummary: () => errorTracker.getErrorSummary(),
    clearErrors: () => errorTracker.clearErrors()
  };
};