import React from 'react';

interface QuantumLoaderProps {
  message?: string;
  subMessage?: string;
}

export const QuantumLoader: React.FC<QuantumLoaderProps> = ({ 
  message = 'Initializing Quantum State',
  subMessage 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="relative">
        {/* Quantum field effect */}
        <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse rounded-full"></div>
        
        {/* Main spinner */}
        <div className="relative animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500">
          {/* Inner quantum particles */}
          <div className="absolute inset-4 rounded-full border border-blue-400/50 animate-ping"></div>
          <div className="absolute inset-8 rounded-full border border-blue-300/30 animate-pulse"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <h2 className="mt-8 text-xl font-semibold">{message}</h2>
      {subMessage && (
        <p className="mt-2 text-sm text-gray-400">{subMessage}</p>
      )}
      
      {/* Progress indicator */}
      <div className="mt-6 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 animate-[quantum-progress_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
};

// Add to your tailwind.config.js:
// {
//   theme: {
//     extend: {
//       keyframes: {
//         'quantum-progress': {
//           '0%': { width: '0%', marginLeft: '0%' },
//           '50%': { width: '30%', marginLeft: '70%' },
//           '100%': { width: '0%', marginLeft: '100%' }
//         }
//       }
//     }
//   }
// }