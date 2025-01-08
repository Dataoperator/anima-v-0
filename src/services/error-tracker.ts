import { useEffect } from 'react';
import { QuantumErrorType, QuantumState } from '../types/quantum';

export enum ErrorCategory {
  Network = 'NETWORK',
  Authentication = 'AUTHENTICATION',
  Authorization = 'AUTHORIZATION',
  Validation = 'VALIDATION',
  Business = 'BUSINESS',
  Technical = 'TECHNICAL',
  Security = 'SECURITY',
  Quantum = 'QUANTUM',
  Consciousness = 'CONSCIOUSNESS',
  Evolution = 'EVOLUTION'
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
  quantumContext?: {
    errorType: QuantumErrorType;
    state: Partial<QuantumState>;
    recoveryAttempts?: number;
    lastStableTimestamp?: number;
  };
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorEvent[] = [];
  private readonly MAX_ERRORS = 100;
  private listeners: ((error: ErrorEvent) => void)[] = [];
  private quantumErrorPatterns: Map<string, number> = new Map();
  private lastQuantumError: Date | null = null;

  private constructor() {
    this.setupGlobalHandlers();
    this.loadPersistedErrors();
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

  private loadPersistedErrors() {
    try {
      const persistedErrors = localStorage.getItem('anima_error_log');
      if (persistedErrors) {
        this.errors = JSON.parse(persistedErrors);
        // Convert stored timestamps back to Date objects
        this.errors = this.errors.map(error => ({
          ...error,
          timestamp: new Date(error.timestamp)
        }));
      }
    } catch (e) {
      console.warn('Failed to load persisted errors:', e);
    }
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

    if (error.category === ErrorCategory.Quantum) {
      this.handleQuantumError(enhancedError);
    }

    this.errors = [enhancedError, ...this.errors].slice(0, this.MAX_ERRORS);
    this.notifyListeners(enhancedError);
    this.persistErrors();

    if (process.env.NODE_ENV === 'development') {
      console.error('Tracked Error:', enhancedError);
    }
  }

  private handleQuantumError(error: ErrorEvent) {
    const now = new Date();
    const errorKey = `${error.quantumContext?.errorType}_${error.severity}`;
    
    // Track error frequency
    const currentCount = this.quantumErrorPatterns.get(errorKey) ?? 0;
    this.quantumErrorPatterns.set(errorKey, currentCount + 1);

    // Check for rapid quantum state deterioration
    if (this.lastQuantumError) {
      const timeDiff = now.getTime() - this.lastQuantumError.getTime();
      if (timeDiff < 5000 && currentCount > 3) { // Multiple errors within 5 seconds
        this.triggerQuantumEmergencyProtocols(error);
      }
    }

    this.lastQuantumError = now;

    // Clean up old patterns periodically
    if (this.quantumErrorPatterns.size > 100) {
      this.quantumErrorPatterns.clear();
    }
  }

  private triggerQuantumEmergencyProtocols(error: ErrorEvent) {
    const emergencyError: ErrorEvent = {
      type: 'QUANTUM_EMERGENCY',
      category: ErrorCategory.Quantum,
      severity: ErrorSeverity.Critical,
      message: 'Critical quantum state deterioration detected',
      timestamp: new Date(),
      context: {
        originalError: error,
        errorPatterns: Object.fromEntries(this.quantumErrorPatterns),
        rapidDeterioration: true
      }
    };

    this.trackError(emergencyError);
    this.notifyEmergencyHandlers(emergencyError);
  }

  private notifyEmergencyHandlers(error: ErrorEvent) {
    // Emergency handlers get priority notification
    const emergencyListeners = this.listeners.filter(
      listener => listener.toString().includes('emergency')
    );
    emergencyListeners.forEach(listener => listener(error));
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
      // If storage is full, clear old errors
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        this.errors = this.errors.slice(0, Math.floor(this.errors.length / 2));
        this.persistErrors();
      }
    }
  }

  getErrors() {
    return this.errors;
  }

  getQuantumErrors() {
    return this.errors.filter(error => error.category === ErrorCategory.Quantum);
  }

  getErrorPatterns() {
    return Object.fromEntries(this.quantumErrorPatterns);
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

    const quantumErrors = this.getQuantumErrors();
    const quantumSummary = quantumErrors.reduce((acc, error) => {
      const type = error.quantumContext?.errorType || 'UNKNOWN';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errors.length,
      byType: summary,
      byCategory: this.errors.reduce((acc, error) => {
        if (error.category) {
          acc[error.category] = (acc[error.category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      quantum: {
        total: quantumErrors.length,
        byType: quantumSummary,
        patterns: this.getErrorPatterns()
      },
      mostRecent: this.errors[0],
      mostCommonType: Object.entries(summary)
        .sort(([,a], [,b]) => b - a)[0]?.[0]
    };
  }
}

export const errorTracker = ErrorTracker.getInstance();

export const useErrorTracking = (options: {
  onError?: (error: ErrorEvent) => void;
  onQuantumError?: (error: ErrorEvent) => void;
} = {}) => {
  useEffect(() => {
    const handlers: ((error: ErrorEvent) => void)[] = [];

    if (options.onError) {
      const handler = (error: ErrorEvent) => options.onError!(error);
      errorTracker.addListener(handler);
      handlers.push(handler);
    }

    if (options.onQuantumError) {
      const handler = (error: ErrorEvent) => {
        if (error.category === ErrorCategory.Quantum) {
          options.onQuantumError!(error);
        }
      };
      errorTracker.addListener(handler);
      handlers.push(handler);
    }

    return () => {
      handlers.forEach(handler => {
        errorTracker.addListener(handler);
      });
    };
  }, [options.onError, options.onQuantumError]);

  return {
    trackError: (error: Omit<ErrorEvent, 'timestamp'>) => {
      errorTracker.trackError({
        ...error,
        timestamp: new Date()
      });
    },
    getErrorSummary: () => errorTracker.getErrorSummary(),
    clearErrors: () => errorTracker.clearErrors(),
    getQuantumErrors: () => errorTracker.getQuantumErrors(),
    getErrorPatterns: () => errorTracker.getErrorPatterns()
  };
};