import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import { useNavigate } from 'react-router-dom';

type FlowStage = 'uninitialized' | 'initialization' | 'genesis' | 'quantum-init' | 'neural-link' | 'complete';

interface FlowContextType {
  currentStage: FlowStage;
  proceedToNext: () => void;
  resetFlow: () => void;
  setCurrentStage: (stage: FlowStage) => void;
  flowData: {
    animaId?: string;
    quantumSignature?: string;
    designationName?: string;
  };
  updateFlowData: (data: Partial<FlowContextType['flowData']>) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const AppFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { identity, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState<FlowStage>('uninitialized');
  const [flowData, setFlowData] = useState<FlowContextType['flowData']>({});

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentStage('uninitialized');
    }
  }, [isAuthenticated]);

  const stagePaths: Record<FlowStage, string> = {
    'uninitialized': '/',
    'initialization': '/initialization',
    'genesis': '/genesis',
    'quantum-init': '/quantum-initialization',
    'neural-link': '/neural-link',
    'complete': '/anima-dashboard'
  };

  const proceedToNext = () => {
    const stages: FlowStage[] = ['uninitialized', 'initialization', 'genesis', 'quantum-init', 'neural-link', 'complete'];
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      setCurrentStage(nextStage);
      navigate(stagePaths[nextStage]);
    }
  };

  const updateFlowData = (data: Partial<FlowContextType['flowData']>) => {
    setFlowData(prev => ({ ...prev, ...data }));
  };

  const resetFlow = () => {
    setCurrentStage('uninitialized');
    setFlowData({});
    navigate('/');
  };

  return (
    <FlowContext.Provider 
      value={{
        currentStage,
        proceedToNext,
        resetFlow,
        setCurrentStage,
        flowData,
        updateFlowData
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useAppFlow = () => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useAppFlow must be used within an AppFlowProvider');
  }
  return context;
};