import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { IntroView } from './IntroView';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      await login();
      // Correct route to quantum vault after login
      navigate('/quantum-vault');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Failed to connect. Please try again.');
    }
  };

  return (
    <ErrorBoundary>
      <IntroView onConnect={handleConnect} error={error} />
    </ErrorBoundary>
  );
};