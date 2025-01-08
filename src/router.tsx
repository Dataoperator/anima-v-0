import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from '@/components/layout/LandingPage';
import { LoginPage } from '@/components/auth/LoginPage';
import { CyberpunkQuantumVault } from '@/components/quantum-vault/CyberpunkQuantumVault';
import { MintAnima } from '@/components/anima/MintAnima';
import { UnifiedNeuralLink } from '@/components/neural-link/UnifiedNeuralLink';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { AnimaGuard } from '@/components/guards/AnimaGuard';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

// Create router configuration
const routes = [
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/quantum-vault',
    element: (
      <AuthGuard>
        <CyberpunkQuantumVault />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/vault',  // Alias for quantum-vault for backwards compatibility
    element: (
      <AuthGuard>
        <CyberpunkQuantumVault />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/genesis',
    element: (
      <AuthGuard>
        <MintAnima />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/neural-link/:id',
    element: (
      <AuthGuard>
        <AnimaGuard>
          <UnifiedNeuralLink />
        </AnimaGuard>
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />
  }
];

// Create and export the router configuration
export const routerConfig = createBrowserRouter(routes);

// Router component
export const Router: React.FC = () => {
  return <RouterProvider router={routerConfig} />;
};