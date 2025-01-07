import { Actor, HttpAgent, HttpAgentOptions, ActorConfig } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { Actor as ActorType } from "./auth/types";
import { createActor as _createActor } from "@/declarations/anima";
import { NETWORK_CONFIG } from '@/config';

interface CreateAgentOptions {
  agent?: HttpAgent;
  agentOptions?: HttpAgentOptions;
  actorOptions?: Omit<ActorConfig, "canisterId" | "agent">;
}

export const createActor = async (
  canisterId: string | Principal,
  options: CreateAgentOptions = {}
): Promise<ActorType> => {
  const agent = options.agent || new HttpAgent({
    host: NETWORK_CONFIG.host,
    ...options.agentOptions
  });

  if (NETWORK_CONFIG.isLocal) {
    await agent.fetchRootKey().catch((error: Error) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(error);
    });
  }

  return _createActor(canisterId.toString(), {
    agent,
    ...options.actorOptions
  }) as ActorType;
};