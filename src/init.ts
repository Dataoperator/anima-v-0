import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "./declarations/anima";

const HOST = "https://icp0.io";
const CANISTER_ID = "l2ilz-iqaaa-aaaaj-qngjq-cai";

export async function initializeIC() {
  try {
    // Initialize auth client first
    const authClient = await AuthClient.create();
    const identity = authClient.getIdentity();

    // Create agent
    const agent = new HttpAgent({ identity, host: HOST });

    // Create actor
    const actor = createActor(CANISTER_ID, { agent });

    // Initialize window.ic
    window.ic = {
      ...window.ic,
      agent,
      canister: actor,
    };

    console.log('✅ IC Initialization complete:', {
      canister: !!window.ic.canister,
      ic: !!window.ic,
      ic_plug: true,
      principal: !!identity?.getPrincipal()
    });

    return true;
  } catch (error) {
    console.error('❌ IC Initialization failed:', error);
    return false;
  }
}