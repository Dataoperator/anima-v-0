import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthConsumerProps {
  children: React.ReactNode;
}

export const AuthConsumer: React.FC<AuthConsumerProps> = ({ children }) => {
  const { isAuthenticated, isInitializing, identity } = useAuth();

  if (isInitializing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin mx-auto text-cyan-400 mb-4" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cyan-300"
          >
            Initializing Quantum Authentication...
          </motion.p>
        </div>
      </div>
    );
  }

  // For development/testing, allow proceeding without authentication
  if (process.env.NODE_ENV === 'development' && !isAuthenticated) {
    console.warn('⚠️ Development mode: Proceeding without authentication');
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    // Instead of a reload button, show the landing page
    return <>{children}</>;
  }

  return <>{children}</>;
}