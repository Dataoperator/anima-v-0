import canisterIds from '../../canister_ids.json';

const DFX_NETWORK = process.env.DFX_NETWORK || 'ic';

export const CANISTER_IDS = {
  anima: DFX_NETWORK === 'ic' ? canisterIds.anima.ic : process.env.CANISTER_ID_ANIMA,
  anima_assets: DFX_NETWORK === 'ic' ? canisterIds.anima_assets.ic : process.env.CANISTER_ID_ANIMA_ASSETS,
  internet_identity: 'rdmx6-jaaaa-aaaaa-aaadq-cai'
};

export const NETWORK_CONFIG = {
  network: DFX_NETWORK,
  isLocal: DFX_NETWORK !== 'ic',
  host: DFX_NETWORK === 'ic' ? 'https://icp0.io' : 'http://127.0.0.1:4943',
};

// For legacy compatibility
export const getCanisterId = (name) => CANISTER_IDS[name];
export const getDfxNetwork = () => NETWORK_CONFIG.network;
export const getHost = () => NETWORK_CONFIG.host;