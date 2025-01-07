// II Canister URLs
export const II_URL = 'https://identity.ic0.app';

// II Configuration
export const II_CONFIG = {
  // Base configuration
  canisterId: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
  derivationOrigin: 'https://lpp2u-jyaaa-aaaaj-qngka-cai.icp0.io',
  
  // Idle timeout configuration
  idleOptions: {
    disableDefaultIdle: false,
    idleTimeout: 1000 * 60 * 30, // 30 minutes
    disableIdle: false,
  },

  // Delegation settings
  maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
  delegationIdentityIdentifier: 'anima-app-delegation',
  
  // Features
  features: {
    enableRecovery: true,
    enableWebAuthn: true,
  }
};