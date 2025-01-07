import React from 'react';
import { MatrixRain } from '@/components/ui/MatrixRain';

interface MatrixLayoutProps {
  children: React.ReactNode;
}

export const MatrixLayout: React.FC<MatrixLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-green-500 p-4 font-mono overflow-hidden">
      <MatrixRain />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};