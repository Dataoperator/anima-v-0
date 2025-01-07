import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AnimaPaymentService } from '@/services/anima-payment';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';

export const usePaymentInit = () => {
  const [paymentService, setPaymentService] = useState<AnimaPaymentService>();
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const { identity } = useAuth();
  const errorTracker = ErrorTracker.getInstance();

  useEffect(() => {
    let mounted = true;

    const initPayment = async () => {
      if (!identity) {
        console.log('🚫 Missing identity');
        return;
      }

      if (isInitializing) {
        return;
      }

      setIsInitializing(true);

      try {
        console.log('🔄 Initializing payment service...');
        const service = new AnimaPaymentService(identity);
        await service.initialize();

        if (mounted) {
          console.log('✅ Payment service initialized with canister:', service.getCanisterId());
          setPaymentService(service);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Failed to initialize payment service:', err);
        
        errorTracker.trackError(
          ErrorCategory.PAYMENT,
          err instanceof Error ? err : new Error('Failed to initialize payment service'),
          ErrorSeverity.HIGH,
          { identity: identity.getPrincipal().toString() }
        );

        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize payment service');
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    initPayment();

    return () => {
      mounted = false;
    };
  }, [identity]);

  const retryInit = async () => {
    setError(null);
    if (identity && !isInitializing) {
      setIsInitializing(true);
      try {
        const service = new AnimaPaymentService(identity);
        await service.initialize();
        setPaymentService(service);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize payment service');
      } finally {
        setIsInitializing(false);
      }
    }
  };

  return { 
    paymentService, 
    error,
    isInitializing,
    retryInit
  };
};