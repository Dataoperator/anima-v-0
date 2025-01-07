import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-black text-green-500 p-8 font-mono flex items-center justify-center">
          <Card className="w-full max-w-xl bg-black border border-green-500">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p className="text-center text-xl">{'>'}SYSTEM ERROR DETECTED</p>
                <p className="text-sm opacity-70 text-center">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full p-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
                >
                  {'>'}REINITIALIZE SYSTEM
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}