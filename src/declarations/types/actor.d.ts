import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE } from '@/declarations/anima/anima.did';

export interface VariantMap {
  [key: string]: null | { GrowthPack: bigint };
}

export interface PaymentResult {
  Ok?: bigint;
  Err?: string;
}

export interface PaymentResponse {
  Ok?: null;
  Err?: string;
}

export interface PaymentMethods extends _SERVICE {
  initiate_payment: (type: VariantMap, tokenId: [] | [bigint]) => Promise<PaymentResult>;
  complete_payment: (blockHeight: bigint) => Promise<PaymentResponse>;
}

export type Actor = ActorSubclass<_SERVICE> & PaymentMethods;

// Define window extensions
declare global {
  interface Window {
    ic?: {
      plug?: {
        createActor: <T>({ 
          canisterId, 
          interfaceFactory 
        }: {
          canisterId: string;
          interfaceFactory: (args: { IDL: any }) => any;
        }) => Promise<T>;
      };
    };
  }
}