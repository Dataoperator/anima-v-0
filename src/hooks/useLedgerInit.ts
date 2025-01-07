import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { IcLedgerService } from '@/services/ic-ledger';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';

export const useLedgerInit = () => {
  const [ledger, setLedger] = useState<IcLedgerService>();
  const [error, setError] = useState<string | null>(null);
  const { identity } = useAuth();
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    let mounted = true;
    
    const initLedger = async () => {
      if (!identity) {
        console.log('🚫 Missing identity');
        return;
      }

      try {
        console.log('🔄 Initializing IC ledger service...');
        
        const ledgerService = new IcLedgerService(identity);
        await ledgerService.initialize();

        if (mounted) {
          console.log('✅ IC ledger service initialized');
          setLedger(ledgerService);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Failed to initialize ledger:', err);
        
        errorTracker.trackError(
          ErrorCategory.LEDGER,
          err instanceof Error ? err : new Error('Failed to initialize ledger service'),
          ErrorSeverity.HIGH,
          {
            identity: identity.getPrincipal().toString()
          }
        );

        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize ledger service');
        }
      }
    };

    initLedger();

    return () => {
      mounted = false;
    };
  }, [identity]);

  return { 
    ledger, 
    error,
    retryInit: async () => {
      setError(null);
      if (identity) {
        const ledgerService = new IcLedgerService(identity);
        await ledgerService.initialize();
        setLedger(ledgerService);
      }
    }
  };
};