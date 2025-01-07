import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full border border-white/20"
          >
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Something went wrong
            </h1>
            
            <p className="text-red-200 mb-6 text-center">
              The app encountered an unexpected error. This might be due to network issues or temporary service disruption.
            </p>

            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleRetry}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </motion.button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 p-4 bg-black/30 rounded-lg overflow-auto"
              >
                <pre className="text-red-300 text-sm">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </motion.div>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };