import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { QuantumWave } from './QuantumAnimations';

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class QuantumErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to your error tracking service
    console.error('Quantum Component Error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="w-full bg-gradient-to-r from-red-500/20 to-purple-500/20">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <QuantumWave 
                frequency={0.5} 
                amplitude={0.2} 
                className="text-red-300 opacity-50" 
              />
              <h3 className="text-lg font-semibold text-white">Quantum State Disruption</h3>
              <p className="text-sm text-white/70">
                A quantum anomaly has been detected in the visualization matrix.
              </p>
              <div className="text-xs text-white/50 font-mono mt-2">
                Error: {this.state.error?.message}
              </div>
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                         text-white rounded-md transition-colors duration-200"
              >
                Recalibrate Quantum Field
              </button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}