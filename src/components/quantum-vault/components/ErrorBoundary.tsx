import React, { Component, ErrorInfo } from 'react';
import { ErrorTracker } from '@/services/error-tracker';
import { ErrorCategory, ErrorSeverity } from '@/types/alerts';
import { AnimatedBackground } from './AnimatedBackground';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  private errorTracker = ErrorTracker.getInstance();

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    await this.errorTracker.trackError({
      type: 'REACT_ERROR',
      category: ErrorCategory.Technical,
      severity: ErrorSeverity.High,
      message: error.message,
      timestamp: new Date(),
      context: {
        componentStack: errorInfo.componentStack,
        error: error.toString(),
        stack: error.stack
      }
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReset = async () => {
    try {
      // Clear quantum state and reload page
      window.location.reload();
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="relative min-h-screen">
          <AnimatedBackground />
          <div className="relative z-10 flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-75">
            <div className="max-w-md p-8 mx-4 bg-gray-800 rounded-lg shadow-xl">
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-red-500">
                  Quantum Field Disruption Detected
                </h2>
                <p className="mb-6 text-gray-300">
                  {this.state.error?.message || 'An unexpected error occurred in the quantum field.'}
                </p>
                <div className="p-4 mb-6 text-left bg-gray-900 rounded">
                  <p className="mb-2 text-sm text-gray-400">Error Details:</p>
                  <pre className="p-2 overflow-x-auto text-xs text-red-300 whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack || 'No stack trace available'}
                  </pre>
                </div>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={this.handleRetry}
                    className="w-full px-6 py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Attempt Quantum Realignment
                  </button>
                  <button
                    onClick={this.handleReset}
                    className="w-full px-6 py-2 text-sm font-semibold text-white transition-colors bg-red-600 rounded hover:bg-red-700"
                  >
                    Emergency Reset
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  If the issue persists, please contact quantum support.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;