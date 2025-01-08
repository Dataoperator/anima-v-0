import React from 'react';
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
import { Loading } from './components/ui/loading';

const App: React.FC = () => {
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