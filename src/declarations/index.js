export { idlFactory as animaIdl } from './anima/anima.did.js';
export { idlFactory as assetsIdl } from './anima_assets/anima_assets.did.js';

import { CANISTER_IDS, NETWORK_CONFIG } from '../config';

export const canisterId = CANISTER_IDS.anima;
export { createActor } from './anima/index.js';