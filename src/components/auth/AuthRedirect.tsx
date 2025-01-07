import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing) {
      if (isAuthenticated) {
        navigate('/quantum-vault');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, isInitializing, navigate]);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
      <div className="animate-pulse">{'>'} ESTABLISHING NEURAL LINK...</div>
    </div>
  );
};