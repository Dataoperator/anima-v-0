export const IC_HOST = 'https://icp0.io';

export const CANISTER_IDS = {
  anima: 'l2ilz-iqaaa-aaaaj-qngjq-cai',
  assets: 'lpp2u-jyaaa-aaaaj-qngka-cai'
} as const;

export const IC_CONFIG = {
  host: IC_HOST,
  whitelist: [
    IC_HOST,
    'https://identity.ic0.app',
    'https://identity.internetcomputer.org'
  ],
  idleOptions: {
    disableIdle: true,
    idleTimeout: 1000 * 60 * 30 // 30 minutes
  }
} as const;