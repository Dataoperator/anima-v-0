import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '../components/error-boundary/ErrorBoundary';
import { initializeIC } from '../config/ic.config';
import { stateManager } from '../enhanced/quantum/StateManager';
import { WalletProvider } from '../contexts/WalletContext';
import type { ActorSubclass } from "@dfinity/agent";
import type { AuthClient } from "@dfinity/auth-client";
import type { _SERVICE } from "../declarations/anima/anima.did";

interface ICContext {
  actor: ActorSubclass<_SERVICE> | null;
  authClient: AuthClient | null;
  isInitialized: boolean;
  error: Error | null;
}

const ICContext = createContext<ICContext>({
  actor: null,
  authClient: null,
  isInitialized: false,
  error: null,
});

export const useIC = () => useContext(ICContext);

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actor, setActor] = useState<ActorSubclass<_SERVICE> | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [quantumInitialized, setQuantumInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing IC client...');
        const { actor: a, authClient: auth } = await initializeIC();
        setActor(a);
        setAuthClient(auth);
        
        console.log('Initializing quantum state...');
        await stateManager.initialize();
        setQuantumInitialized(true);
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err as Error);
      }
    };

    init();
    console.log('AppProviders mounted');

    return () => {
      console.log('AppProviders unmounted');
    };
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Initialization Error</h1>
          <p className="text-red-400">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized || !quantumInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-white">
          {!isInitialized ? 'Initializing Internet Computer...' : 'Initializing Quantum State...'}
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary onError={(error) => console.error('ErrorBoundary caught:', error)}>
      <ICContext.Provider value={{ actor, authClient, isInitialized, error }}>
        <WalletProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </WalletProvider>
      </ICContext.Provider>
    </ErrorBoundary>
  );
};