import React from 'react';

const QuantumWave = ({ frequency = 1, amplitude = 1, className }) => (
  <svg
    viewBox="0 0 100 20"
    className={`w-full h-8 ${className}`}
    preserveAspectRatio="none"
  >
    <path
      d={`M 0 10 ${Array.from({ length: 100 }, (_, i) => {
        const x = i;
        const y = 10 + Math.sin(x * frequency * 0.1) * amplitude * 5;
        return `L ${x} ${y}`;
      }).join(' ')}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className="animate-pulse"
    />
  </svg>
);

const CoherenceRing = ({ value = 0, className }) => (
  <svg viewBox="0 0 100 100" className={`w-24 h-24 ${className}`}>
    <circle
      cx="50"
      cy="50"
      r="45"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray={`${value * 283} 283`}
      className="transform -rotate-90 transition-all duration-1000"
    />
  </svg>
);

const DimensionalPortal = ({ active = false, className }) => (
  <div className={`relative w-32 h-32 ${className}`}>
    <div 
      className={`
        absolute inset-0 rounded-full 
        bg-gradient-to-r from-purple-500 to-indigo-500
        animate-spin-slow transition-all duration-500
        ${active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
      `}
    >
      <div className="absolute inset-2 rounded-full bg-black/20 backdrop-blur-sm" />
    </div>
  </div>
);

const EntanglementBeam = ({ active = false, className }) => (
  <div className={`w-full h-1 ${className}`}>
    <div 
      className={`
        h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent
        transition-all duration-300 transform
        ${active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
      `}
    />
  </div>
);

export { QuantumWave, CoherenceRing, DimensionalPortal, EntanglementBeam };
