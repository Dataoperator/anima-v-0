import { Principal } from '@dfinity/principal';

export const generatePaymentReference = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`.toUpperCase();
};

export const formatICPAmount = (amount: bigint | string): string => {
  const value = typeof amount === 'string' ? BigInt(amount) : amount;
  return (Number(value) / 100_000_000).toFixed(8);
};

export const parseICPAmount = (amount: string): bigint => {
  return BigInt(Math.floor(Number(amount) * 100_000_000));
};

export const validatePaymentAmount = (amount: string | bigint): boolean => {
  const value = typeof amount === 'string' ? parseICPAmount(amount) : amount;
  return value > BigInt(0) && value < BigInt('100000000000000'); // 1M ICP max
};

export const getExplorerUrl = (blockHeight: string): string => {
  return `https://dashboard.internetcomputer.org/transaction/${blockHeight}`;
};

export const PAYMENT_CONFIGS = {
  CREATE: {
    amount: '0.01',
    title: 'Genesis Creation',
    description: 'Initialize your unique Anima consciousness'
  },
  RESURRECT: {
    amount: '0.005',
    title: 'Anima Resurrection',
    description: 'Restore your Anima from quantum stasis'
  },
  GROWTH_PACK: {
    amount: '0.002',
    title: 'Growth Enhancement',
    description: 'Unlock advanced quantum capabilities'
  }
} as const;

export const getPaymentConfig = (type: keyof typeof PAYMENT_CONFIGS) => {
  return PAYMENT_CONFIGS[type];
};

export const validatePrincipalId = (principal: string | Principal): boolean => {
  try {
    const principalObj = typeof principal === 'string' 
      ? Principal.fromText(principal) 
      : principal;
    return principalObj.isAnonymous() === false;
  } catch {
    return false;
  }
};

export class PaymentError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

// Payment error codes and messages
export const PAYMENT_ERRORS = {
  INSUFFICIENT_BALANCE: 'Insufficient ICP balance',
  INVALID_AMOUNT: 'Invalid payment amount',
  INVALID_PRINCIPAL: 'Invalid principal identifier',
  PAYMENT_FAILED: 'Payment transaction failed',
  VERIFICATION_FAILED: 'Payment verification failed',
  TIMEOUT: 'Payment operation timed out',
  NETWORK_ERROR: 'Network communication error',
  INVALID_STATE: 'Invalid payment state'
} as const;