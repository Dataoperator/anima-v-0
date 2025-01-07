import { useCallback, useEffect } from 'react';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';
import { useAuth } from '@/contexts/auth-context';

export function useErrorLogging(category: ErrorCategory) {
  const { principal } = useAuth();
  const errorTracker = ErrorTracker.getInstance();

  const logError = useCallback((
    error: Error,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    extraContext: Record<string, any> = {}
  ) => {
    return errorTracker.trackError(category, error, severity, {
      principal,
      ...extraContext,
      timestamp: Date.now()
    });
  }, [category, principal]);

  // Subscribe to all errors in this category
  useEffect(() => {
    const unsubscribe = errorTracker.subscribeToErrors((errorCategory, error, context) => {
      if (errorCategory === category) {
        // Implement any category-specific error handling
        console.warn(`Error in ${category}:`, { error, context });
      }
    });

    return () => unsubscribe();
  }, [category]);

  return {
    logError,
    getErrorReport: () => errorTracker.getErrorReport(category),
    clearErrors: () => errorTracker.clearErrors(category)
  };
}