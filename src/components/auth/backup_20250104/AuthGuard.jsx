import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';

export const AuthGuard = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for authentication initialization
    if (!isInitializing) {
      if (!isAuthenticated) {
        // Redirect to login with return path
        navigate('/', { 
          state: { from: location.pathname },
          replace: true 
        });
      }
      setIsLoading(false);
    }
  }, [isAuthenticated, isInitializing, navigate, location]);

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-green-500 font-mono text-center"
        >
          <div className="mb-4">INITIALIZING SECURITY PROTOCOLS...</div>
          <div className="w-16 h-16 border-t-2 border-green-500 rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  // User is authenticated, render protected content
  return <Outlet />;
};

// Export as default as well for backward compatibility
export default AuthGuard;