import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from '@/components/layout/LandingPage';
import LoginPage from '@/components/auth/LoginPage';
import { MintAnima } from '@/components/anima/MintAnima';
import AnimaPage from '@/components/anima/AnimaPage';
import { UnifiedNeuralLink } from '@/components/neural-link/UnifiedNeuralLink';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { AnimaGuard } from '@/components/guards/AnimaGuard';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

const router = createBrowserRouter([
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
    path: '/mint',
    element: (
      <AuthGuard>
        <MintAnima />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/anima/:id',
    element: (
      <AuthGuard>
        <AnimaGuard>
          <AnimaPage />
        </AnimaGuard>
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
]);

export default function Router() {
  return <RouterProvider router={router} />;
}