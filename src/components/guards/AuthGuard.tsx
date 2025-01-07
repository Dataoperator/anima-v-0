import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { animaActorService } from '@/services/anima-actor.service';

interface Props {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, identity, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('🔍 AuthGuard initializing...');
      
      try {
        if (!isAuthenticated) {
          // Redirect to login if not authenticated
          navigate('/login', { state: { from: location.pathname } });
          return;
        }

        if (identity) {
          // Create actor with identity
          animaActorService.createActor(identity);
          console.log('✅ Identity initialized:', identity.getPrincipal().toText());
        }
      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [isAuthenticated, identity, location.pathname]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-500 text-lg">Verifying authentication...</div>
      </div>
    );
  }

  return <>{children}</>;
};