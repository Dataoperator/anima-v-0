import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export const AuthRedirect = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // After authentication, go to quantum vault
    navigate('/quantum-vault');

  }, [isAuthenticated, isInitializing, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-green-400 text-xl animate-pulse">
        {'>'} ESTABLISHING QUANTUM CONNECTION...
      </div>
    </div>
  );
};