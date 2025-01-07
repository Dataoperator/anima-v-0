import { Identity, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from "./declarations/anima";
import { idlFactory as ledgerIDL } from "./declarations/ledger/ledger.did.js";
import { _SERVICE as AnimaService } from './declarations/anima/anima.did';
import { _SERVICE as LedgerService } from './declarations/ledger/ledger.did.d';
import { ErrorTracker } from './error/quantum_error';
import { Principal } from '@dfinity/principal';
import { Actor, ActorSubclass } from '@dfinity/agent';

const CANISTER_ID = {
  anima: process.env.CANISTER_ID_ANIMA?.toString() || 'l2ilz-iqaaa-aaaaj-qngjq-cai',
  assets: process.env.CANISTER_ID_ANIMA_ASSETS?.toString() || 'lpp2u-jyaaa-aaaaj-qngka-cai',
  ledger: 'ryjl3-tyaaa-aaaaa-aaaba-cai' // ICP Ledger canister ID
};

const HOST = 'https://icp0.io';

type StageChangeCallback = (stage: string) => void;

export async function createICPLedgerActor(identity: Identity): Promise<ActorSubclass<LedgerService>> {
  const agent = new HttpAgent({
    identity,
    host: HOST
  });

  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey().catch(console.error);
  }

  return Actor.createActor(ledgerIDL, {
    agent,
    canisterId: Principal.fromText(CANISTER_ID.ledger)
  });
}

class ICManager {
  private static instance: ICManager;
  private actor: AnimaService | null = null;
  private agent: HttpAgent | null = null;
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;
  private initialized = false;
  private initializing = false;
  private stageChangeCallbacks: StageChangeCallback[] = [];
  private errorTracker: ErrorTracker;

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
    if (typeof window !== 'undefined') {
      window.ic = {
        ...(window.ic || {}),
        agent: null,
        HttpAgent
      };
    }
  }

  static getInstance(): ICManager {
    if (!ICManager.instance) {
      ICManager.instance = new ICManager();
    }
    return ICManager.instance;
  }

  onStageChange(callback: StageChangeCallback) {
    this.stageChangeCallbacks.push(callback);
  }

  private updateStage(stage: string) {
    console.log('IC Stage:', stage);
    this.stageChangeCallbacks.forEach(callback => callback(stage));
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('IC already initialized');
      return;
    }

    if (this.initializing) {
      console.log('IC initialization already in progress');
      return;
    }

    try {
      this.initializing = true;
      console.log('Starting IC initialization...');

      this.updateStage('Creating AuthClient...');
      if (!this.authClient) {
        this.authClient = await AuthClient.create({
          idleOptions: { disableIdle: true }
        });
      }
      
      this.updateStage('Getting identity...');
      this.identity = this.authClient.getIdentity();
      if (!this.identity) {
        throw new Error('Failed to get identity');
      }

      const principal = this.identity.getPrincipal();
      console.log('Identity principal:', principal.toText());

      this.updateStage('Creating HttpAgent...');
      this.agent = new HttpAgent({
        identity: this.identity,
        host: HOST
      });

      if (process.env.NODE_ENV !== 'production') {
        this.updateStage('Fetching root key...');
        await this.agent.fetchRootKey().catch(console.error);
      }

      const canisterId = CANISTER_ID.anima?.replace(/['"]/g, '');
      if (!canisterId) {
        throw new Error('Invalid canister ID');
      }

      this.updateStage('Creating Actor...');
      this.actor = await createActor(canisterId, {
        agent: this.agent
      }) as AnimaService;

      // Verify the actor
      if (!this.actor || typeof this.actor.initialize_genesis !== 'function') {
        throw new Error('Actor creation failed or missing required methods');
      }

      this.updateStage('Setting up window.ic...');
      window.ic = {
        ...(window.ic || {}),
        agent: this.agent,
        HttpAgent
      };

      if (this.actor) {
        window.canister = this.actor;
      }
      
      this.initialized = true;
      this.initializing = false;
      this.updateStage('Initialization complete!');

    } catch (error) {
      this.initializing = false;
      await this.errorTracker.trackError({
        errorType: 'IC_INIT_ERROR',
        severity: 'HIGH',
        context: 'IC Initialization',
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      throw error;
    }
  }

  getActor(): AnimaService | null {
    return this.actor;
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getAgent(): HttpAgent | null {
    return this.agent;
  }

  getAuthClient(): AuthClient | null {
    return this.authClient;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

declare global {
  interface Window {
    ic: {
      agent: HttpAgent | null;
      HttpAgent: any;
    };
    canister: AnimaService | null;
  }
}

export const icManager = ICManager.getInstance();

// Initialize immediately
icManager.initialize().catch(console.error);