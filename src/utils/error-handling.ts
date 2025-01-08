import { ErrorInfo } from 'react';

export interface ErrorMetadata {
  componentStack?: string;
  quantum?: {
    stability?: number;
    coherence?: number;
    resonance?: number;
  };
  context?: Record<string, any>;
}

export interface ErrorReport {
  timestamp: number;
  error: Error;
  metadata: ErrorMetadata;
  handled: boolean;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorReport[] = [];
  private readonly MAX_LOGS = 50;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error, errorInfo?: ErrorInfo, context?: Record<string, any>): void {
    const report: ErrorReport = {
      timestamp: Date.now(),
      error,
      metadata: {
        componentStack: errorInfo?.componentStack,
        context
      },
      handled: false
    };

    this.logError(report);
    this.notifyError(report);
  }

  private logError(report: ErrorReport): void {
    this.errorLog.unshift(report);
    if (this.errorLog.length > this.MAX_LOGS) {
      this.errorLog.pop();
    }

    console.error('[ANIMA Error]', {
      message: report.error.message,
      stack: report.error.stack,
      metadata: report.metadata
    });
  }

  private notifyError(report: ErrorReport): void {
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: report.error.message,
          stack: report.error.stack,
          metadata: report.metadata,
          timestamp: report.timestamp
        })
      }).catch(console.error);
    }
  }

  getRecentErrors(): ErrorReport[] {
    return [...this.errorLog];
  }

  clearErrors(): void {
    this.errorLog = [];
  }

  markErrorHandled(timestamp: number): void {
    const report = this.errorLog.find(r => r.timestamp === timestamp);
    if (report) {
      report.handled = true;
    }
  }

  getUnhandledErrors(): ErrorReport[] {
    return this.errorLog.filter(report => !report.handled);
  }
}

export const errorHandler = ErrorHandler.getInstance();
export default errorHandler;