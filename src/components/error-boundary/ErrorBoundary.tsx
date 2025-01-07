import React, { Component, ErrorInfo } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full space-y-4 text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="p-6 bg-gray-800 rounded-lg border border-red-500/30 backdrop-blur-sm"
            >
              <h2 className="text-xl font-bold text-red-400 mb-4">
                Quantum State Destabilized
              </h2>
              <p className="text-gray-300 mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={this.handleRetry}
                className="px-6 py-2 bg-red-500/10 border border-red-500/30 
                         rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Reinitialize Quantum State
              </button>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}