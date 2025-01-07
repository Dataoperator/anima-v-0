import React, { useEffect, useState } from 'react';
import { icManager } from '@/ic-init';
import { LoadingFallback } from '../ui/LoadingFallback';

interface Props {
  children: React.ReactNode;
}

export const InitializationManager: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState({
    isInitialized: false,
    error: null as Error | null
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        await icManager.initialize();
        setState({ isInitialized: true, error: null });
      } catch (error) {
        console.error('Initialization failed:', error);
        setState({ 
          isInitialized: false, 
          error: error instanceof Error ? error : new Error('Initialization failed') 
        });
      }
    };

    initialize();
  }, []);

  if (state.error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-lg p-6">
          <h1 className="text-xl font-bold mb-4">Initialization Error</h1>
          <p className="text-red-400 mb-4">{state.error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!state.isInitialized) {
    return <LoadingFallback />;
  }

  return <>{children}</>;
};