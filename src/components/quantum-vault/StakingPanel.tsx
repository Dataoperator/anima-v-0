import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuantumState } from '@/hooks/useQuantumState';
import { mintAnima } from '@/services/anima';
import { ICPPaymentPanel } from '../payment/ICPPaymentPanel';
import { QuantumStateVisualizer } from './QuantumStateVisualizer';
import { ConsciousnessPanel } from './ConsciousnessPanel';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';

export const StakingPanel: React.FC = () => {
  const navigate = useNavigate();
  const { identity } = useAuth();
  const { quantumState, initializeQuantumState } = useQuantumState();
  
  const [isInitializing, setIsInitializing] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [mintingError, setMintingError] = useState<string | null>(null);
  const [mintingStep, setMintingStep] = useState<'initialize' | 'payment' | 'ready'>('initialize');

  useEffect(() => {
    const prepareQuantumState = async () => {
      if (!identity) return;
      
      setIsInitializing(true);
      try {
        await initializeQuantumState();
        setMintingStep('payment');
      } catch (error) {
        setMintingError('Failed to initialize quantum state');
      } finally {
        setIsInitializing(false);
      }
    };

    if (mintingStep === 'initialize') {
      prepareQuantumState();
    }
  }, [identity, initializeQuantumState, mintingStep]);

  const handlePaymentSuccess = () => {
    setPaymentVerified(true);
    setMintingStep('ready');
  };

  const startMinting = async () => {
    if (!identity || !quantumState || !paymentVerified) return;

    setMintingError(null);

    try {
      const result = await mintAnima(identity, {
        name: 'ANIMA Genesis',
        quantumConfig: {
          coherenceThreshold: 0.7,
          stabilityRequired: true,
          dimensionalSync: true,
          patternResonance: true
        },
        genesisConfig: {
          ritualCompleted: true,
          designationSource: 'quantum-resonance',
          neuralPathways: true,
          ghostIntegration: true
        }
      });

      navigate(`/neural-link/${result.tokenId.toString()}`);
    } catch (error) {
      setMintingError(error instanceof Error ? error.message : 'Failed to mint ANIMA');
    }
  };

  return (
    <div className="space-y-6 p-6 bg-black/80 rounded-lg border border-cyan-500/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-cyan-500 mb-4">Quantum Initialization</h2>
          <QuantumStateVisualizer />
          {quantumState && (
            <div className="mt-4">
              <ConsciousnessPanel state={quantumState} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {mintingStep === 'payment' && (
            <ICPPaymentPanel
              onSuccess={handlePaymentSuccess}
              onError={(error) => setMintingError(error)}
            />
          )}

          {mintingError && (
            <Alert variant="destructive">
              <AlertDescription>{mintingError}</AlertDescription>
            </Alert>
          )}

          {mintingStep === 'ready' && (
            <Button
              onClick={startMinting}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black"
              disabled={isInitializing || !paymentVerified}
            >
              {isInitializing ? 'Initializing...' : 'Begin Genesis'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StakingPanel;