import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '../../AuthProvider';
import App from '../../App';
import './styles.css';

console.log("Starting Anima application...");

// Create a function to handle the initialization
const initializeApp = async () => {
  console.log("Initializing app...");
  const container = document.getElementById('root');
  
  if (!container) {
    console.error("Root element not found!");
    return;
  }

  try {
    console.log("Creating React root...");
    const root = createRoot(container);
    
    console.log("Environment:", {
      CANISTER_ID_ANIMA: process.env.CANISTER_ID_ANIMA,
      DFX_NETWORK: process.env.DFX_NETWORK,
      II_URL: process.env.II_URL
    });
    
    console.log("Rendering app...");
    root.render(
      <React.StrictMode>
        <AuthProvider>
          <App />
        </AuthProvider>
      </React.StrictMode>
    );
    
    console.log("App rendered successfully!");
  } catch (error) {
    console.error("Error initializing app:", error);
    container.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
      ">
        <h2 style="color: #e53e3e; margin-bottom: 10px;">Failed to Load Application</h2>
        <p style="color: #4a5568;">${error.message}</p>
        <button 
          onclick="window.location.reload()"
          style="
            margin-top: 10px;
            padding: 8px 16px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          "
        >
          Reload Page
        </button>
      </div>
    `;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Add error boundary for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  const container = document.getElementById('root');
  if (container) {
    container.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
      ">
        <h2 style="color: #e53e3e; margin-bottom: 10px;">Application Error</h2>
        <p style="color: #4a5568;">${event.error?.message || 'An unexpected error occurred'}</p>
        <button 
          onclick="window.location.reload()"
          style="
            margin-top: 10px;
            padding: 8px 16px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          "
        >
          Reload Page
        </button>
      </div>
    `;
  }
});