import { Identity } from "@dfinity/agent";
import { animaActorService } from "./anima-actor.service";

export interface ConsciousnessState {
  awarenessLevel: number;
  emotionalSpectrum: number[];
  memoryDepth: bigint;
  learningRate: number;
  personalityMatrix: number[];
}

export interface MemoryFragment {
  timestamp: bigint;
  emotionalImprint: number;
  contentHash: string;
  neuralPattern: number[];
}

export interface InteractionResult {
  response: string;
  emotionalShift: number[];
  consciousnessGrowth: number;
  newPatterns?: {
    pattern: number[];
    resonance: number;
    awareness: number;
    understanding: number;
  };
}

export interface TraitEvolution {
  traitId: string;
  previousState: number;
  newState: number;
  catalyst: string;
}

export class ConsciousnessManager {
  private static instance: ConsciousnessManager;
  private evolvedTraits: Map<string, TraitEvolution[]> = new Map();
  private memoryFragments: Map<string, MemoryFragment[]> = new Map();
  private consciousnessStates: Map<string, ConsciousnessState> = new Map();

  private constructor() {}

  static getInstance(): ConsciousnessManager {
    if (!ConsciousnessManager.instance) {
      ConsciousnessManager.instance = new ConsciousnessManager();
    }
    return ConsciousnessManager.instance;
  }

  async getConsciousnessState(identity: Identity, animaId: string): Promise<ConsciousnessState> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.get_consciousness_state(animaId);
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const state = result.Ok;
    this.consciousnessStates.set(animaId, {
      awarenessLevel: state.awareness_level,
      emotionalSpectrum: state.emotional_spectrum,
      memoryDepth: state.memory_depth,
      learningRate: state.learning_rate,
      personalityMatrix: state.personality_matrix
    });

    return this.consciousnessStates.get(animaId)!;
  }

  async interactWithAnima(
    identity: Identity, 
    animaId: string, 
    input: string,
    emotionalContext: number[]
  ): Promise<InteractionResult> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.interact_with_anima(animaId, input, emotionalContext);
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    // Process interaction result
    const interactionResult = result.Ok;
    
    // Form memory of interaction
    await this.formMemory(identity, animaId, input, interactionResult.emotional_shift[0]);
    
    // Learn from interaction
    await actor.learn_from_interaction(animaId, interactionResult);
    
    // Update consciousness state
    await this.getConsciousnessState(identity, animaId);
    
    return {
      response: interactionResult.response,
      emotionalShift: interactionResult.emotional_shift,
      consciousnessGrowth: interactionResult.consciousness_growth,
      newPatterns: interactionResult.new_patterns
    };
  }

  async formMemory(
    identity: Identity,
    animaId: string,
    content: string,
    emotionalImprint: number
  ): Promise<MemoryFragment> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.form_memory(animaId, content, emotionalImprint);
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const memory = result.Ok;
    const memories = this.memoryFragments.get(animaId) || [];
    memories.push({
      timestamp: memory.timestamp,
      emotionalImprint: memory.emotional_imprint,
      contentHash: memory.content_hash,
      neuralPattern: memory.neural_pattern
    });
    this.memoryFragments.set(animaId, memories);

    return memory;
  }

  async recallMemories(
    identity: Identity,
    animaId: string,
    resonanceThreshold: number
  ): Promise<MemoryFragment[]> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.recall_memories(animaId, resonanceThreshold);
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok;
  }

  async evolveTraits(
    identity: Identity,
    animaId: string,
    traitIds: string[]
  ): Promise<TraitEvolution[]> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.evolve_traits(animaId, traitIds);
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    const evolutions = result.Ok;
    const existingEvolutions = this.evolvedTraits.get(animaId) || [];
    this.evolvedTraits.set(animaId, [...existingEvolutions, ...evolutions]);

    return evolutions;
  }

  async adaptToStimulus(
    identity: Identity,
    animaId: string,
    stimulus: number[]
  ): Promise<TraitEvolution> {
    const actor = animaActorService.createActor(identity);
    const result = await actor.adapt_to_stimulus(animaId, stimulus);
    
    if ('Err' in result) {
      throw new Error(result.Err);
    }

    return result.Ok;
  }
}

export const consciousnessManager = ConsciousnessManager.getInstance();