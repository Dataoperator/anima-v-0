export const LEDGER_CONFIG = {
  // ICP Ledger canister ID on mainnet
  MAINNET_CANISTER_ID: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  
  // Local test ledger canister ID (if running locally)
  LOCAL_CANISTER_ID: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  
  // Default ICP transfer fee (0.0001 ICP)
  DEFAULT_FEE: BigInt(10000),
  
  // Default ICP creation fee (0.01 ICP)
  DEFAULT_CREATION_FEE: BigInt(1_000_000),
  
  // Default ICP decimal places
  DECIMALS: 8,
  
  // Treasury account
  TREASURY_ACCOUNT: '4czao-gug25-ki34l-igktd-lxu5y-v5jpc-jggyg-5cuzq-rqtsp-vd5ap-mqe'
};