import { Principal } from '@dfinity/principal';

interface ErrorEvent {
  type: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: number;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorEvent[] = [];
  private readonly MAX_ERRORS = 100;

  private constructor() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    window.addEventListener('error', this.handleError.bind(this));
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  trackError(error: Error, context?: Record<string, any>) {
    const errorEvent: ErrorEvent = {
      type: error.name,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    };

    this.addError(errorEvent);
    this.logError(errorEvent);
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    const error = event.reason;
    this.trackError(
      error instanceof Error ? error : new Error(String(error)),
      { type: 'unhandledRejection' }
    );
  }

  private handleError(event: ErrorEvent) {
    this.trackError(
      new Error(event.message),
      { 
        type: 'windowError',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    );
  }

  private addError(error: ErrorEvent) {
    this.errors.push(error);
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors.shift();
    }
  }

  private logError(error: ErrorEvent) {
    console.error('[ErrorTracker]', error);
    
    // In production, we could send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      try {
        fetch('/api/log-error', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(error)
        }).catch(console.error);
      } catch (e) {
        console.error('Failed to log error:', e);
      }
    }
  }

  getRecentErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export default ErrorTracker.getInstance();