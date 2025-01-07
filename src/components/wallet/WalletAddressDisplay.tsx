import React, { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@dfinity/nns';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';

export const WalletAddressDisplay: React.FC = () => {
  const { identity } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (identity) {
      const principal = identity.getPrincipal();
      const accountId = AccountIdentifier.fromPrincipal({
        principal,
        subAccount: undefined
      }).toHex();
      setWalletAddress(accountId);
    }
  }, [identity]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-green-500/30 p-4 space-y-4 font-mono relative overflow-hidden"
    >
      <h3 className="text-lg font-semibold text-green-500">{'>'} YOUR ICP WALLET ADDRESS</h3>
      <div className="relative">
        <div className="break-all bg-black/50 p-3 text-sm text-green-400 font-mono">
          {walletAddress}
        </div>
        <motion.div 
          className="absolute inset-0 bg-green-500/10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      <div className="space-y-2 text-sm text-green-400/60">
        <p>1. Send exactly 1.0 ICP to this address</p>
        <p>2. Wait for confirmation (usually 1-2 minutes)</p>
        <p>3. Click 'Check Balance' to verify your deposit</p>
      </div>
      <button
        onClick={copyToClipboard}
        className="w-full py-2 border border-green-500/50 text-green-500 hover:bg-green-500/10 transition-all duration-300 relative group"
      >
        <span className={copied ? 'opacity-0' : 'opacity-100'}>
          {'>'} COPY ADDRESS
        </span>
        <span 
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}
        >
          {'>'} COPIED!
        </span>
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: copied ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </button>
    </motion.div>
  );
};