import { HttpAgent, Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory } from "../../declarations/anima/anima.did.js";
import { canisterEnv } from "./env";

const host = process.env.DFX_NETWORK === "ic" 
  ? "https://icp0.io" 
  : "http://localhost:4943";

export async function createActor() {
  const authClient = await AuthClient.create();
  const agent = new HttpAgent({
    host,
    identity: authClient.getIdentity(),
  });

  if (process.env.DFX_NETWORK !== "ic") {
    await agent.fetchRootKey().catch((err) => {
      console.warn("Unable to fetch root key. Check your connection and the canister ID:", err);
    });
  }

  if (!canisterEnv.anima) {
    throw new Error("Anima canister ID not found in environment");
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterEnv.anima,
  });
}

export async function getAgent() {
  const authClient = await AuthClient.create();
  return new HttpAgent({
    host,
    identity: authClient.getIdentity(),
  });
}