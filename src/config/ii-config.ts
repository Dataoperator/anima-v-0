export const II_URL = process.env.DFX_NETWORK === 'ic'
  ? 'https://identity.ic0.app'
  : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`;

export const AUTH_MAX_TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);