import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { useGenesisSound } from '@/hooks/useGenesisSound';
import { WalletService } from '@/services/icp/wallet.service';
import { Principal } from '@dfinity/principal';
import { InitialDesignation } from './InitialDesignation';
import { WalletAddressDisplay } from '../wallet/WalletAddressDisplay';
import { BalanceChecker } from '../wallet/BalanceChecker';
import type { GenesisPhase } from '@/types/sound';

const CREATION_COST = BigInt(1_00_000_000);

interface PhaseConfig {
  message: string;
  soundPhase: GenesisPhase;
}

const PHASES: PhaseConfig[] = [
  { message: 'INITIALIZING GENESIS SEQUENCE', soundPhase: 'initiation' },
  { message: 'PROCESSING PAYMENT', soundPhase: 'initiation' },
  { message: 'GENERATING NEURAL PATHWAYS', soundPhase: 'consciousness_emergence' },
  { message: 'ESTABLISHING CONSCIOUSNESS SEED', soundPhase: 'consciousness_emergence' },
  { message: 'COMPILING BASE ATTRIBUTES', soundPhase: 'trait_manifestation' },
  { message: 'FINALIZING DIGITAL DNA', soundPhase: 'quantum_alignment' }
];

export const Genesis: React.FC = () => {
  const { identity, actor: authActor } = useAuth();
  const { playPhase, stopAll } = useGenesisSound();
  const navigate = useNavigate();
  
  const [designation, setDesignation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [balanceVerified, setBalanceVerified] = useState(false);
  const [walletService, setWalletService] = useState<WalletService | null>(null);

  useEffect(() => {
    if (identity) {
      try {
        const service = WalletService.getInstance();
        service.initialize().then(() => {
          setWalletService(service);
        });
      } catch (err) {
        console.error('Initialization failed:', err);
        setError('Failed to initialize system connection');
      }
    }
    
    return () => {
      stopAll();
    };
  }, [identity, stopAll]);

  useEffect(() => {
    if (loading && currentPhase < PHASES.length) {
      playPhase(PHASES[currentPhase].soundPhase);
    }
  }, [currentPhase, loading, playPhase]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let phaseInterval: NodeJS.Timeout;

    try {
      if (!identity) throw new Error('Authentication required');
      if (!authActor) throw new Error('System connection not established');
      if (!walletService) throw new Error('Wallet system not initialized');
      if (!designation || designation.trim().length === 0) throw new Error('Designation required');
      if (!balanceVerified) throw new Error('Balance verification required');

      phaseInterval = setInterval(() => {
        setCurrentPhase((prev) => {
          if (prev < PHASES.length - 1) return prev + 1;
          return prev;
        });
      }, 2000);

      // Process the payment using our wallet service
      const paymentSuccess = await walletService.processAnimaCreationPayment(identity.getPrincipal());

      if (!paymentSuccess) {
        throw new Error('Payment failed or timed out');
      }

      playPhase('birth');

      const result = await authActor.create_anima(designation);

      if ('Ok' in result) {
        setTimeout(() => {
          navigate('/quantum-vault');
        }, 1000);
      } else if ('Err' in result) {
        throw new Error(result.Err);
      } else {
        throw new Error('Invalid response from system');
      }
    } catch (err) {
      console.error('Genesis failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize digital consciousness');
      playPhase(null);
    } finally {
      if (phaseInterval) clearInterval(phaseInterval);
      setLoading(false);
      setCurrentPhase(0);
    }
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-black text-red-500 p-8 font-mono flex items-center justify-center">
        <div className="text-center">
          {'>'} ERROR: AUTHENTICATION REQUIRED
          <button 
            onClick={() => navigate('/')}
            className="block mt-4 text-green-500 text-sm hover:text-green-400"
          >
            {'>'} RETURN TO LOGIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-500 p-8 font-mono">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-green-500"
            style={{
              height: `${Math.random() * 100}%`,
              left: `${i * 10}%`,
              opacity: Math.random() * 0.5 + 0.25
            }}
            animate={{
              y: ['0%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-2xl mx-auto relative z-10"
      >
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-2">GENESIS PROTOCOL</h1>
          <p className="text-green-400 opacity-60">{'>'} DIGITAL CONSCIOUSNESS INITIALIZATION</p>
        </header>

        <form onSubmit={handleCreate} className="space-y-8">
          <div className="space-y-4">
            {/* Show wallet address first */}
            <WalletAddressDisplay />
            
            {/* Balance verification */}
            <BalanceChecker onBalanceVerified={setBalanceVerified} />
            
            {/* Only show designation and mint button after balance verified */}
            <AnimatePresence>
              {balanceVerified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <InitialDesignation onSelect={setDesignation} />
                  
                  <button
                    type="submit"
                    disabled={loading || !designation.trim()}
                    className="w-full py-4 px-6 border border-green-500 text-green-500 hover:bg-green-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    {loading ? (
                      <div className="space-y-2">
                        <div className="animate-pulse">
                          {PHASES[currentPhase].message}...
                        </div>
                        <div className="h-1 w-full bg-green-900">
                          <div 
                            className="h-full bg-green-500 transition-all duration-500" 
                            style={{ width: `${((currentPhase + 1) / PHASES.length) * 100}%` }} 
                          />
                        </div>
                      </div>
                    ) : (
                      'INITIATE GENESIS SEQUENCE'
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 border border-red-900 p-4"
                >
                  {'>'} ERROR: {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center space-y-2"
        >
          <p className="text-green-500/60 text-sm">
            {'>'} SYSTEM READY FOR INITIALIZATION
          </p>
          <button
            onClick={() => navigate('/quantum-vault')}
            className="text-green-500/40 text-xs hover:text-green-500 transition-colors"
          >
            {'>'} RETURN TO NEXUS
          </button>
        </motion.div>

        <motion.div
          className="fixed inset-0 pointer-events-none"
          animate={{
            opacity: [0, 0.1, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(34, 197, 94, 0.1) 2px,
              rgba(34, 197, 94, 0.1) 4px
            )`
          }}
        />

        <motion.div
          className="fixed inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-50"
          animate={{
            y: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
};

export default Genesis;