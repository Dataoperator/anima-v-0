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
import { useAppFlow } from '@/contexts/AppFlow';
import type { GenesisPhase } from '@/types/sound';

// Previous PHASES and CREATION_COST constants remain the same...

export const Genesis: React.FC = () => {
  const { identity, actor: authActor } = useAuth();
  const { playPhase, stopAll } = useGenesisSound();
  const navigate = useNavigate();
  const { proceedToNext, updateFlowData } = useAppFlow();
  
  // Previous state declarations remain the same...

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let phaseInterval: NodeJS.Timeout;

    try {
      // Previous validation checks remain the same...

      phaseInterval = setInterval(() => {
        setCurrentPhase((prev) => {
          if (prev < PHASES.length - 1) return prev + 1;
          return prev;
        });
      }, 2000);

      // Process the payment
      const paymentSuccess = await walletService.processAnimaCreationPayment(identity.getPrincipal());
      if (!paymentSuccess) {
        throw new Error('Payment failed or timed out');
      }

      playPhase('birth');

      const result = await authActor.create_anima(designation);

      if ('Ok' in result) {
        // Update flow data with new ANIMA details
        updateFlowData({
          animaId: result.Ok.toString(),
          designationName: designation
        });
        
        // Proceed to next stage in flow
        setTimeout(() => {
          proceedToNext();
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

  // Rest of the component remains the same...
}