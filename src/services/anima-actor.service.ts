import { Identity } from "@dfinity/agent";
import { createActor } from "@/declarations/anima";
import type { _SERVICE } from '@/declarations/anima/anima.did';
import { ErrorTracker } from '@/error/quantum_error';

const FALLBACK_CANISTER_ID = 'l2ilz-iqaaa-aaaaj-qngjq-cai';

const sanitizeCanisterId = (id: string | undefined): string => {
  if (!id) return FALLBACK_CANISTER_ID;
  // Remove quotes and whitespace
  return id.replace(/['"]/g, '').trim();
};

const validateCanisterId = (id: string): boolean => {
  // Basic canister ID validation
  const canisterRegex = /^[a-z0-9-]+$/;
  return canisterRegex.test(id) && id.length > 0;
};

export class AnimaActorService {
  private static instance: AnimaActorService;
  private actor: _SERVICE | null = null;
  private errorTracker: ErrorTracker;
  private canisterId: string;

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
    this.canisterId = sanitizeCanisterId(process.env.CANISTER_ID_ANIMA);

    if (!validateCanisterId(this.canisterId)) {
      console.error('Invalid canister ID, using fallback:', this.canisterId);
      this.canisterId = FALLBACK_CANISTER_ID;
    }

    console.log('🔗 Initialized AnimaActorService with canister:', this.canisterId);
  }

  static getInstance(): AnimaActorService {
    if (!AnimaActorService.instance) {
      AnimaActorService.instance = new AnimaActorService();
    }
    return AnimaActorService.instance;
  }

  createActor(identity: Identity): _SERVICE {
    try {
      if (!identity) {
        throw new Error('No identity provided for actor creation');
      }

      const principal = identity.getPrincipal();
      if (principal.isAnonymous()) {
        throw new Error('Cannot create actor with anonymous identity');
      }

      console.log('🔧 Creating actor with canister:', this.canisterId);
      this.actor = createActor(this.canisterId, {
        agentOptions: {
          identity,
          host: "https://icp0.io"
        }
      });

      if (!this.actor) {
        throw new Error('Actor creation failed');
      }

      // Verify actor has required methods
      const requiredMethods = [
        'initialize_quantum_field',
        'generate_neural_patterns',
        'check_quantum_stability'
      ];

      const missingMethods = requiredMethods.filter(
        method => !(method in (this.actor as any))
      );

      if (missingMethods.length > 0) {
        throw new Error(`Actor missing required methods: ${missingMethods.join(', ')}`);
      }

      return this.actor;

    } catch (error) {
      this.errorTracker.trackError({
        errorType: 'ACTOR_CREATION',
        severity: 'HIGH',
        context: 'AnimaActorService',
        error: error instanceof Error ? error : new Error('Actor creation failed')
      });
      throw error;
    }
  }

  verifyActor(): boolean {
    return !!this.actor && 'initialize_quantum_field' in this.actor;
  }

  getActor(): _SERVICE | null {
    if (!this.actor) {
      console.warn('⚠️ Attempting to get actor before initialization');
      return null;
    }
    return this.actor;
  }

  resetActor(): void {
    this.actor = null;
  }

  getCurrentCanisterId(): string {
    return this.canisterId;
  }
}

export const animaActorService = AnimaActorService.getInstance();