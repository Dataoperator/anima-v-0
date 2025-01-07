import type { Identity } from "@dfinity/agent";
import type { ActorSubclass } from "@dfinity/agent";
import type { _SERVICE } from '@/declarations/anima/anima.did';
import type { HttpAgentOptions } from "@dfinity/agent";

export type { Identity };
export type Actor = ActorSubclass<_SERVICE>;

export interface ActorOptions {
  agent?: any;
  agentOptions?: HttpAgentOptions;
  actorOptions?: Record<string, unknown>;
}

export interface AuthManager {
  init(): Promise<void>;
  login(): Promise<Identity>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  getIdentity(): Identity;
  getActor(): Actor | null;
  updateActivity(): void;
}