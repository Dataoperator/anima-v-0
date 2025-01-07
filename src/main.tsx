import './polyfills';  // Must be first import
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Ensure React is initialized globally for context creation
window.React = React;

// Import components directly to avoid lazy loading issues
import App from './App';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { LoadingFallback } from './components/ui/LoadingFallback';

const RootErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="text-center max-w-lg p-6">
      <h1 className="text-xl font-bold mb-4">System Error</h1>
      <p className="text-red-400 mb-4">{error.message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
      >
        Reset System
      </button>
    </div>
  </div>
);

async function initializeApp() {
  try {
    const statusElement = document.querySelector('.quantum-status');
    if (statusElement) {
      statusElement.textContent = 'Initializing Internet Computer connection...';
    }

    console.log('Initializing Internet Computer connection...');
    await import('./ic-init');
    console.log('IC initialization complete');
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Root element not found');
    }

    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <ErrorBoundary FallbackComponent={RootErrorFallback}>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);
    const statusElement = document.querySelector('.quantum-status');
    if (statusElement) {
      statusElement.textContent = `Initialization failed: ${error.message}`;
    }
  }
}

// Initialize
initializeApp();