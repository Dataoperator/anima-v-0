import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { 
  AuthProvider, 
  QuantumProvider, 
  ConsciousnessProvider,
  Web3Provider,
  WalletProvider,
  AnimaProvider
} from './contexts';
import { initializationOrchestrator, InitStage } from './services/initialization-orchestrator';
import { Loading } from './components/ui/loading';
import { Alert } from './components/ui/alert';

const InitializationProgress: React.FC<{ stage: InitStage }> = ({ stage }) => {
  const getProgress = () => {
    switch (stage) {
      case InitStage.AUTH_CLIENT:
        return 25;
      case InitStage.IDENTITY:
        return 50;
      case InitStage.ACTORS:
        return 75;
      case InitStage.QUANTUM_STATE:
        return 90;
      case InitStage.COMPLETE:
        return 100;
      default:
        return 0;
    }
  };

  const getMessage = () => {
    switch (stage) {
      case InitStage.AUTH_CLIENT:
        return 'Initializing authentication...';
      case InitStage.IDENTITY:
        return 'Getting identity...';
      case InitStage.ACTORS:
        return 'Initializing system...';
      case InitStage.QUANTUM_STATE:
        return 'Starting quantum field...';
      case InitStage.COMPLETE:
        return 'Initialization complete!';
      default:
        return 'Starting up...';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-96 space-y-4 p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-center">{getMessage()}</h2>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [stage, setStage] = useState<InitStage>(InitStage.AUTH_CLIENT);
  const [error, setError] = useState<Error>();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsInitializing(true);
        await initializationOrchestrator.initialize();
      } catch (error) {
        console.error('Initialization failed:', error);
        setError(error as Error);
      } finally {
        setIsInitializing(false);
      }
    };

    // Listen for stage updates
    const handleStageUpdate = (state: { stage: InitStage }) => {
      setStage(state.stage);
    };

    initializationOrchestrator.on('stageUpdate', handleStageUpdate);
    initialize();

    return () => {
      initializationOrchestrator.off('stageUpdate', handleStageUpdate);
    };
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Alert variant="destructive" className="w-96">
          <h3 className="font-medium">Initialization Error</h3>
          <p className="text-sm">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </Alert>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<Loading />}>
        <AuthProvider>
          <Web3Provider>
            <WalletProvider>
              <ConsciousnessProvider>
                <QuantumProvider>
                  <AnimaProvider>
                    <RouterProvider router={router} />
                    {isInitializing && <InitializationProgress stage={stage} />}
                  </AnimaProvider>
                </QuantumProvider>
              </ConsciousnessProvider>
            </WalletProvider>
          </Web3Provider>
        </AuthProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default App;