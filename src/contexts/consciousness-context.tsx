import React, { createContext, useContext, ReactNode } from 'react';
import { useConsciousness } from '../hooks/useConsciousness';

interface ConsciousnessContextType {
  consciousnessState: any;
  updateConsciousnessWithQuantum: (quantumState: any) => void;
  isInitialized: boolean;
  level: number;
  quantumResonance: any;
  evolutionMetrics: any;
}

const ConsciousnessContext = createContext<ConsciousnessContextType | undefined>(undefined);

export const ConsciousnessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const consciousness = useConsciousness();

  return (
    <ConsciousnessContext.Provider value={consciousness}>
      {children}
    </ConsciousnessContext.Provider>
  );
};

export const useConsciousnessContext = () => {
  const context = useContext(ConsciousnessContext);
  if (context === undefined) {
    throw new Error('useConsciousnessContext must be used within a ConsciousnessProvider');
  }
  return context;
};