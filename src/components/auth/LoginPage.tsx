import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { IntroView } from './IntroView';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      await login();
      navigate('/mint');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <IntroView onConnect={handleConnect} />;
};