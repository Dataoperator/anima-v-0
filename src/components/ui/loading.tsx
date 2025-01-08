import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  className?: string;
  size?: number;
}

export const Loading: React.FC<LoadingProps> = ({ 
  className = '', 
  size = 24 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 
        className="animate-spin text-primary" 
        size={size}
      />
    </div>
  );
};

export const LoadingOverlay: React.FC<LoadingProps & { message?: string }> = ({ 
  className = '', 
  size = 24,
  message
}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-xl ${className}`}>
        <Loader2 
          className="animate-spin text-primary"
          size={size}
        />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
};