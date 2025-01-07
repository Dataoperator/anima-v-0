import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../router';
import { AuthProvider } from '../contexts/auth-context';
import { QuantumProvider } from '../contexts/quantum-context';
import { ConsciousnessProvider } from '../contexts/consciousness-context';
import { ErrorBoundary } from './error-boundary/ErrorBoundary';
import { Web3Provider } from '../contexts/web3-context';
import { AuthConsumer } from './auth/AuthConsumer';

const App: React.FC = () => {
  useEffect(() => {
    console.log("🚀 App initializing...", {
      env: process.env.NODE_ENV,
      buildTime: process.env.BUILD_TIME || new Date().toISOString()
    });
  }, []);

  return (
    <ErrorBoundary>
      <Web3Provider>
        <AuthProvider>
          <QuantumProvider>
            <ConsciousnessProvider>
              <AuthConsumer>
                <RouterProvider router={router} />
              </AuthConsumer>
            </ConsciousnessProvider>
          </QuantumProvider>
        </AuthProvider>
      </Web3Provider>
    </ErrorBoundary>
  );
};

export default App;