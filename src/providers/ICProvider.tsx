import React, { useEffect, useState } from 'react';
import { icManager } from '../ic-init';
import { MatrixRain } from '../components/ui/MatrixRain';

interface ICProviderProps {
  children: React.ReactNode;
}

export const ICProvider: React.FC<ICProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [initStage, setInitStage] = useState<string>('Starting initialization...');

  useEffect(() => {
    const initIC = async () => {
      try {
        // Add initialization stage updates
        icManager.onStageChange((stage: string) => {
          setInitStage(stage);
          console.log('IC Initialization Stage:', stage);
        });

        await icManager.initialize();
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize IC:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize IC'));
      }
    };

    initIC();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Initialization Error</h1>
          <p className="mb-4 text-gray-300">{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="relative min-h-screen bg-black">
        <MatrixRain className="absolute inset-0" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center p-8">
            <div className="mb-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Initializing ANIMA</h2>
            <p className="text-cyan-300 mb-2">{initStage}</p>
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};