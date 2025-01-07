export enum ErrorCategory {
  PAYMENT = 'PAYMENT',
  QUANTUM = 'QUANTUM',
  AI = 'AI',
  AUTHENTICATION = 'AUTH',
  NETWORK = 'NETWORK'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

interface ErrorContext {
  category: ErrorCategory;
  severity: ErrorSeverity;
  metadata?: Record<string, any>;
  timestamp: number;
}

export class ErrorTracker {
  private errors: Map<string, ErrorContext[]> = new Map();
  
  trackError(error: Error, context: ErrorContext) {
    const existingErrors = this.errors.get(context.category) || [];
    existingErrors.push({
      ...context,
      timestamp: Date.now()
    });
    
    this.errors.set(context.category, existingErrors);
    
    if (context.severity === ErrorSeverity.CRITICAL) {
      this.handleCriticalError(error, context);
    }
  }
  
  private handleCriticalError(error: Error, context: ErrorContext) {
    // Implement critical error handling logic
    console.error('Critical error:', {
      error,
      context,
      timestamp: new Date().toISOString()
    });
  }
  
  getErrorsByCategory(category: ErrorCategory) {
    return this.errors.get(category) || [];
  }
  
  clearErrors(category?: ErrorCategory) {
    if (category) {
      this.errors.delete(category);
    } else {
      this.errors.clear();
    }
  }
}