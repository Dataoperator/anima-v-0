import React from 'react';
import { Router } from './router.tsx';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { AppProviders } from './providers/AppProviders';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Router />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;