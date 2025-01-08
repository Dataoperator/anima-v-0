import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppFlowProvider } from '@/contexts/AppFlow';
import { LandingPage } from '@/components/layout/LandingPage';
import { InitializationFlow } from '@/components/anima/InitializationFlow';
import { Genesis } from '@/components/genesis/Genesis';
import { AnimaPage } from '@/components/anima/AnimaPage';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { AnimaGuard } from '@/components/guards/AnimaGuard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/initialization',
    element: (
      <AuthGuard>
        <InitializationFlow />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/genesis',
    element: (
      <AuthGuard>
        <Genesis />
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
  }
]);

export const Router = () => (
  <AppFlowProvider>
    <RouterProvider router={router} />
  </AppFlowProvider>
);