import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "../declarations/anima";

export const CANISTER_IDS = {
  anima: "l2ilz-iqaaa-aaaaj-qngjq-cai",
  assets: "lpp2u-jyaaa-aaaaj-qngka-cai",
} as const;

const HOST = "https://icp0.io";

export async function initializeIC() {
  console.log('Initializing IC connection...');
  
  try {
    // Create auth client for identity management
    const authClient = await AuthClient.create();
    
    // Create agent for IC communication
    const agent = new HttpAgent({ 
      host: HOST,
      identity: authClient.getIdentity()
    });

    // Create actor instance
    const actor = createActor(CANISTER_IDS.anima, {
      agent,
    });

    console.log('IC initialization complete');
    
    return {
      actor,
      agent,
      authClient
    };
  } catch (error) {
    console.error('Error initializing IC:', error);
    throw error;
  }
}

export const ICConfig = {
  host: HOST,
  canisterIds: CANISTER_IDS,
};