import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { AuthProvider } from '@/contexts/auth-context';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { Motion, quantum } from '@/providers/MotionProvider';

const LoadingFallback = () => (
  <Motion.div
    className="flex items-center justify-center min-h-screen bg-black text-white"
    variants={quantum}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    <div className="text-center">
      <div className="animate-pulse">Initializing ANIMA...</div>
    </div>
  </Motion.div>
);

export const RootLayout: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PaymentProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Motion.div
              className="min-h-screen bg-black"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={quantum}
            >
              <Outlet />
            </Motion.div>
          </Suspense>
        </PaymentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default RootLayout;