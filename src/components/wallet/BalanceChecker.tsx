import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { WalletService } from '@/services/icp/wallet.service';
import { motion, AnimatePresence } from 'framer-motion';

export const BalanceChecker: React.FC<{
  onBalanceVerified: (sufficient: boolean) => void;
}> = ({ onBalanceVerified }) => {
  const { identity } = useAuth();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [currentBalance, setCurrentBalance] = useState<string>('0');
  
  const checkBalance = async () => {
    if (!identity) return;
    
    setChecking(true);
    setError(null);
    
    try {
      const walletService = WalletService.getInstance();
      const userAccountId = walletService.getUserAccountIdentifier(identity.getPrincipal());
      const balance = await walletService.ledgerActor.account_balance({ account: userAccountId });
      
      const sufficient = balance.e8s >= BigInt(1_00_000_000); // 1 ICP
      setCurrentBalance((Number(balance.e8s) / 100_000_000).toFixed(8));
      onBalanceVerified(sufficient);
      setLastCheck(new Date());

      console.log('Balance check:', {
        userAccountId,
        balance: balance.e8s.toString(),
        sufficient,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Balance check failed:', err);
      setError('Failed to verify balance. Please try again.');
      onBalanceVerified(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // Initial balance check
    if (identity) {
      checkBalance();
    }
  }, [identity]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="border border-green-500/30 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-green-500">{'>'} CURRENT BALANCE:</span>
          <span className="text-green-400 font-mono">{currentBalance} ICP</span>
        </div>
        
        {lastCheck && (
          <div className="text-xs text-green-400/60">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        )}
      </div>

      <button
        onClick={checkBalance}
        disabled={checking}
        className="w-full py-4 border border-green-500 text-green-500 hover:bg-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group transition-all duration-300"
      >
        <span className="relative z-10">
          {checking ? 'VERIFYING...' : '> CHECK BALANCE'}
        </span>
        
        <AnimatePresence>
          {checking && (
            <motion.div
              className="absolute inset-0 bg-green-500/10"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </AnimatePresence>
      </button>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 border border-red-900 p-4 overflow-hidden"
          >
            {'>'} ERROR: {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};