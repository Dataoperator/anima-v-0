import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminMetrics();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/quantum-vault');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};