import React from 'react';
import { motion } from 'framer-motion';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Auth Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-black flex items-center justify-center text-cyan-500"
        >
          <div className="max-w-lg p-6 bg-black/40 backdrop-blur-lg border border-cyan-500/30 rounded-lg">
            <h2 className="text-xl font-mono mb-4">Neural Interface Error</h2>
            <div className="space-y-4">
              <p className="font-mono text-sm opacity-80">
                Critical system malfunction detected. Error code: {this.state.error?.message || 'Unknown'}
              </p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-red-400">System Status: Unstable</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded text-sm"
                >
                  Reinitialize System
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}