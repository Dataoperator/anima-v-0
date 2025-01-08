import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, CheckCircle } from 'lucide-react';
import { useAnima } from '@/hooks/useAnima';
import { QRCodeCanvas } from '@/components/ui/QRCode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DepositAddressProps {
  address: string;
  className?: string;
}

export const DepositAddress: React.FC<DepositAddressProps> = ({ address, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const { quantumState } = useAnima();

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const formatAddress = (addr: string): string => {
    if (!addr) return '';
    const start = addr.slice(0, 8);
    const end = addr.slice(-8);
    return `${start}...${end}`;
  };

  return (
    <Card className={`p-6 space-y-4 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-lg font-semibold">Your ICP Deposit Address</h3>
        
        <div className="w-48 h-48 bg-white p-2 rounded-lg">
          <QRCodeCanvas 
            value={address}
            size={192}
            level="H"
            className="w-full h-full"
          />
        </div>

        <motion.div 
          className="flex items-center space-x-2 bg-black/5 dark:bg-white/5 p-3 rounded-lg w-full"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <span className="font-mono text-sm flex-1 text-center">
            {formatAddress(address)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={handleCopy}
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </motion.div>

        <div className="text-sm text-muted-foreground text-center">
          <p>Only send ICP to this address</p>
          {quantumState?.coherence > 0.8 && (
            <p className="text-green-500 mt-1">
              ✨ High quantum coherence detected! Enhanced minting rewards available
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DepositAddress;