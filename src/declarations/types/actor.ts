import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { TokenIdentifier } from '../anima/anima.did';

export type Result<T, E = string> = { Ok: T } | { Err: E };

export type AnimaResult = Result<{
  id: TokenIdentifier;
  owner: Principal;
  name: string;
  creation_time: bigint;
  last_interaction: bigint;
  autonomous_enabled: boolean;
}>;

export type AnimasResult = Result<Array<{
  id: TokenIdentifier;
  owner: Principal;
  name: string;
  creation_time: bigint;
  last_interaction: bigint;
  autonomous_enabled: boolean;
}>>;

export type InteractionResponse = Result<{
  response: string;
  personality_update: {
    trait: string;
    value: number;
  }[];
  memory: {
    timestamp: bigint;
    content: string;
  };
}>;

export type OptionalInteraction = Result<{
  response: string;
  personality_update: {
    trait: string;
    value: number;
  }[] | null;
  memory: {
    timestamp: bigint;
    content: string;
  } | null;
} | null>;

export type EmptyResult = Result<null>;

export interface Actor extends ActorSubclass<any> {
  create_anima: (name: string) => Promise<Result<Principal>>;
  get_user_animas: () => Promise<AnimaResult[]>;
  interact_with_anima: (id: TokenIdentifier, message: string) => Promise<InteractionResponse>;
  get_autonomous_message: (id: TokenIdentifier) => Promise<OptionalInteraction>;
  enable_autonomous_mode: (id: TokenIdentifier) => Promise<EmptyResult>;
  disable_autonomous_mode: (id: TokenIdentifier) => Promise<EmptyResult>;
  getCanisterPrincipal: () => Promise<Principal>;
}