import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { AuthProvider } from '@/contexts/auth-context';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { Motion, quantum } from '@/providers/MotionProvider';

// Lazy-loaded components
const LandingPage = React.lazy(() => import('@/components/pages/LandingPage'));
const GenesisPage = React.lazy(() => import('@/components/pages/GenesisPage'));
const AnimaPage = React.lazy(() => import('@/components/pages/AnimaPage'));
const AdminPage = React.lazy(() => import('@/components/admin/AdminManagement'));

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

const RootLayout: React.FC = () => {
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
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/genesis" element={<GenesisPage />} />
                <Route path="/anima/:id" element={<AnimaPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Motion.div>
          </Suspense>
        </PaymentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default RootLayout;