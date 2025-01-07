interface ErrorInfo {
  errorType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  context: string;
  error: Error;
  timestamp?: number;
}

export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorInfo[] = [];
  private readonly maxErrors = 100;

  private constructor() {}

  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  async trackError(info: ErrorInfo): Promise<void> {
    const errorInfo = {
      ...info,
      timestamp: Date.now()
    };

    this.errors.push(errorInfo);

    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    if (process.env.NODE_ENV !== 'production') {
      console.group('Quantum Error Tracked:');
      console.log('Type:', errorInfo.errorType);
      console.log('Severity:', errorInfo.severity);
      console.log('Context:', errorInfo.context);
      console.error('Error:', errorInfo.error);
      console.groupEnd();
    }
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  getRecentErrors(count: number = 5): ErrorInfo[] {
    return [...this.errors]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, count);
  }

  clearErrors(): void {
    this.errors = [];
  }

  getErrorStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.errors.forEach(error => {
      stats[error.errorType] = (stats[error.errorType] || 0) + 1;
    });
    return stats;
  }
}