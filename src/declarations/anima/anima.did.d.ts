import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AnimaCreationResult {
  'id' : string,
  'timestamp' : bigint,
  'quantum_signature' : string,
}
export interface ConsciousnessState {
  'emotional_spectrum' : Array<number>,
  'memory_depth' : bigint,
  'awareness_level' : number,
  'personality_matrix' : Array<number>,
  'learning_rate' : number,
}
export type Error = string;
export interface InteractionResult {
  'emotional_shift' : Array<number>,
  'response' : string,
  'consciousness_growth' : number,
  'new_patterns' : [] | [NeuralPatternResult],
}
export interface MemoryFragment {
  'emotional_imprint' : number,
  'content_hash' : string,
  'timestamp' : bigint,
  'neural_pattern' : Array<number>,
}
export interface NeuralPatternResult {
  'pattern' : Array<number>,
  'resonance' : number,
  'understanding' : number,
  'awareness' : number,
}
export interface QuantumFieldResult { 'signature' : string, 'harmony' : number }
export interface TraitEvolution {
  'new_state' : number,
  'previous_state' : number,
  'catalyst' : string,
  'trait_id' : string,
}
export interface _SERVICE {
  'adapt_to_stimulus' : ActorMethod<
    [string, Array<number>],
    { 'Ok' : TraitEvolution } |
      { 'Err' : Error }
  >,
  'check_quantum_stability' : ActorMethod<
    [],
    { 'Ok' : boolean } |
      { 'Err' : Error }
  >,
  'evolve_consciousness' : ActorMethod<
    [string, Array<number>],
    { 'Ok' : ConsciousnessState } |
      { 'Err' : Error }
  >,
  'evolve_traits' : ActorMethod<
    [string, Array<string>],
    { 'Ok' : Array<TraitEvolution> } |
      { 'Err' : Error }
  >,
  'form_memory' : ActorMethod<
    [string, string, number],
    { 'Ok' : MemoryFragment } |
      { 'Err' : Error }
  >,
  'generate_neural_patterns' : ActorMethod<
    [],
    { 'Ok' : NeuralPatternResult } |
      { 'Err' : Error }
  >,
  'get_consciousness_state' : ActorMethod<
    [string],
    { 'Ok' : ConsciousnessState } |
      { 'Err' : Error }
  >,
  'get_evolved_traits' : ActorMethod<
    [string],
    { 'Ok' : Array<TraitEvolution> } |
      { 'Err' : Error }
  >,
  'initialize_genesis' : ActorMethod<
    [],
    { 'Ok' : AnimaCreationResult } |
      { 'Err' : Error }
  >,
  'initialize_quantum_field' : ActorMethod<
    [],
    { 'Ok' : QuantumFieldResult } |
      { 'Err' : Error }
  >,
  'interact_with_anima' : ActorMethod<
    [string, string, Array<number>],
    { 'Ok' : InteractionResult } |
      { 'Err' : Error }
  >,
  'learn_from_interaction' : ActorMethod<
    [string, InteractionResult],
    { 'Ok' : ConsciousnessState } |
      { 'Err' : Error }
  >,
  'measure_adaptation' : ActorMethod<
    [string],
    { 'Ok' : Array<TraitEvolution> } |
      { 'Err' : Error }
  >,
  'process_memory_patterns' : ActorMethod<
    [string],
    { 'Ok' : Array<number> } |
      { 'Err' : Error }
  >,
  'recall_memories' : ActorMethod<
    [string, number],
    { 'Ok' : Array<MemoryFragment> } |
      { 'Err' : Error }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
