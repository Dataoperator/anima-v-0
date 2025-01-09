import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { QuantumProvider } from './contexts/quantum-context';
import { AuthProvider } from './contexts/auth-context';
import { AnimaProvider } from './contexts/anima-context';
import { NeuralProvider } from './contexts/neural-context';
import { LoadingFallback } from './components/ui/LoadingFallback';
import { AppRoutes } from './routes.tsx';
import { AppProviders } from './providers/AppProviders';

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <QuantumProvider>
            <AnimaProvider>
              <NeuralProvider>
                <AppProviders>
                  <React.Suspense fallback={<LoadingFallback />}>
                    <AppRoutes />
                  </React.Suspense>
                </AppProviders>
              </NeuralProvider>
            </AnimaProvider>
          </QuantumProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;