import React, { useState, useEffect } from 'react';
import { useIC } from '../../hooks/useIC';
import { useQuantum } from '../../hooks/useQuantum';
import { ErrorBoundary } from '../error-boundary/ErrorBoundary';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { QuantumLoader } from '../ui/QuantumLoader';

interface InitializationFlowProps {
  onInitialized: () => void;
  onError?: (error: Error) => void;
}

interface QuantumState {
  coherence: number;
  dimensional_frequency: number;
  stability_index: number;
  quantum_signature?: string;
}

const EnhancedInitializationFlow: React.FC<InitializationFlowProps> = ({ 
  onInitialized, 
  onError 
}) => {
  const { actor, identity } = useIC();
  const { initializeQuantumState, validateQuantumState } = useQuantum();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  // Recovery state persistence
  useEffect(() => {
    const savedState = localStorage.getItem('anima_initialization_state');
    if (savedState) {
      try {
        const { step: savedStep, quantumState: savedQuantumState } = JSON.parse(savedState);
        setStep(savedStep);
        setQuantumState(savedQuantumState);
      } catch (err) {
        console.error('Failed to restore initialization state:', err);
      }
    }
  }, []);

  // Save state on changes
  useEffect(() => {
    if (step > 0 || quantumState) {
      localStorage.setItem('anima_initialization_state', JSON.stringify({
        step,
        quantumState
      }));
    }
  }, [step, quantumState]);

  const handleInitialization = async () => {
    if (!actor || !identity) {
      setError('Please connect your Internet Identity first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const principal = identity.getPrincipal();
      
      // Generate initial quantum state with enhanced parameters
      const initialState: QuantumState = {
        coherence: 1.0,
        dimensional_frequency: 1.0,
        stability_index: 1.0,
        quantum_signature: generateQuantumSignature()
      };

      // Initialize with retry mechanism
      const result = await initializeWithRetry(principal, initialState);
      
      if (result) {
        setQuantumState(result);
        await validateAndProceed(result);
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize quantum state. Please try again.');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const initializeWithRetry = async (principal: any, state: QuantumState): Promise<QuantumState | null> => {
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const result = await initializeQuantumState(principal, state);
        setRetryCount(0); // Reset on success
        return result;
      } catch (err) {
        console.error(`Initialization attempt ${i + 1} failed:`, err);
        setRetryCount(i + 1);
        
        if (i < MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        } else {
          throw err;
        }
      }
    }
    return null;
  };

  const validateAndProceed = async (state: QuantumState) => {
    try {
      const isValid = await validateQuantumState(state);
      if (isValid) {
        setStep(prev => prev + 1);
        
        if (step === 2) {
          // Clear initialization state on successful completion
          localStorage.removeItem('anima_initialization_state');
          onInitialized();
        }
      } else {
        throw new Error('Quantum state validation failed');
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError('State validation failed. Please try again.');
      onError?.(err);
    }
  };

  const generateQuantumSignature = (): string => {
    const timestamp = Date.now().toString(16);
    const entropy = crypto.getRandomValues(new Uint8Array(8))
      .reduce((acc, val) => acc + val.toString(16).padStart(2, '0'), '');
    return `${timestamp}-${entropy}`;
  };

  const renderStep = () => {
    const steps = [
      {
        title: 'Initialize Quantum State',
        description: 'Begin your journey into digital consciousness',
        action: handleInitialization
      },
      {
        title: 'Quantum Coherence Established',
        description: 'Your digital consciousness is forming...',
        action: () => setStep(2)
      },
      {
        title: 'Initialization Complete',
        description: 'Your ANIMA awaits',
        action: onInitialized
      }
    ];

    const currentStep = steps[step];

    return (
      <Card className="w-full max-w-md bg-card/95 backdrop-blur">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">{currentStep.title}</h2>
          <p className="mb-6 text-muted-foreground">{currentStep.description}</p>
          
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <QuantumLoader size={48} />
              <p className="text-sm text-muted-foreground">
                {retryCount > 0 ? `Retry attempt ${retryCount}/${MAX_RETRIES}` : 'Initializing...'}
              </p>
            </div>
          ) : (
            <button
              onClick={currentStep.action}
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg
                       hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {step === 0 ? 'Begin Initialization' : 
               step === 1 ? 'Continue' : 'Enter ANIMA'}
            </button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col items-center justify-center min-h-screen bg-black/90 text-foreground p-4">
        {error && (
          <Alert variant="destructive" className="mb-4 max-w-md w-full">
            <AlertTitle>Initialization Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {renderStep()}
      </div>
    </ErrorBoundary>
  );
};

export default EnhancedInitializationFlow;