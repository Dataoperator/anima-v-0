import React, { createContext, useContext, ReactNode } from 'react';

interface Web3ContextType {
  isInitialized: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  isInitialized: false
});

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Web3Context.Provider value={{ isInitialized: true }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};