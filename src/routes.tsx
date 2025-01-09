import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { AnimaGuard } from '@/components/guards/AnimaGuard';
import LandingPage from '@/components/layout/LandingPage';
import { LoginPage } from '@/components/auth/LoginPage';
import { CyberpunkQuantumVault } from '@/components/quantum-vault/CyberpunkQuantumVault';
import { MintAnima } from '@/components/anima/MintAnima';
import { UnifiedNeuralLink } from '@/components/neural-link/UnifiedNeuralLink';
import RootLayout from '@/components/layout/RootLayout';

export const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route element={<AuthGuard />}>
            <Route path="/quantum-vault" element={<CyberpunkQuantumVault />} />
            <Route path="/vault" element={<Navigate to="/quantum-vault" replace />} />
            <Route path="/genesis" element={<MintAnima />} />
            
            <Route element={<AnimaGuard />}>
              <Route path="/neural-link/:id" element={<UnifiedNeuralLink />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
};