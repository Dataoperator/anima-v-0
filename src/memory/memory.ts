import { Memory } from './types';
import { QuantumState } from '../quantum/types';

export class MemorySystem {
  private memories: Memory[] = [];
  private readonly maxMemories = 100;

  constructor() {
    this.memories = [];
  }

  createMemory(
    description: string,
    importance: number,
    keywords: string[] = [],
    quantumState?: QuantumState
  ): Memory {
    const memory: Memory = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      importance: Math.max(0, Math.min(1, importance)),
      description,
      keywords,
      quantumResonance: quantumState?.resonanceMetrics.fieldStrength || 0,
      emotionalDepth: importance * (quantumState?.coherence || 1)
    };

    this.addMemory(memory);
    return memory;
  }

  private addMemory(memory: Memory) {
    this.memories.push(memory);
    if (this.memories.length > this.maxMemories) {
      // Remove least important memory
      const leastImportantIndex = this.memories
        .reduce((minIndex, mem, index, arr) => 
          mem.importance < arr[minIndex].importance ? index : minIndex
        , 0);
      this.memories.splice(leastImportantIndex, 1);
    }
    this.memories.sort((a, b) => b.importance - a.importance);
  }

  decay(decayFactor: number) {
    this.memories = this.memories
      .map(memory => ({
        ...memory,
        importance: memory.importance * (1 - decayFactor)
      }))
      .filter(memory => memory.importance > 0.1);
  }

  reinforce(memoryId: string, amount: number) {
    const memory = this.memories.find(m => m.id === memoryId);
    if (memory) {
      memory.importance = Math.min(1, memory.importance + amount);
    }
  }

  calculateResonance(currentQuantumState: QuantumState): number {
    if (this.memories.length === 0) return 0;

    const resonances = this.memories.map(memory => {
      const timeFactor = Math.exp(-(Date.now() - memory.timestamp) / (7 * 24 * 60 * 60 * 1000));
      const quantumAlignment = Math.abs(memory.quantumResonance - currentQuantumState.resonanceMetrics.fieldStrength);
      return memory.importance * timeFactor * (1 - quantumAlignment);
    });

    return resonances.reduce((sum, r) => sum + r, 0) / resonances.length;
  }

  getMemories(): Memory[] {
    return [...this.memories];
  }

  getRecentMemories(count: number = 5): Memory[] {
    return [...this.memories]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  getMostImportant(count: number = 5): Memory[] {
    return [...this.memories]
      .sort((a, b) => b.importance - a.importance)
      .slice(0, count);
  }

  searchMemories(query: string): Memory[] {
    const searchTerms = query.toLowerCase().split(' ');
    return this.memories.filter(memory => 
      searchTerms.some(term =>
        memory.description.toLowerCase().includes(term) ||
        memory.keywords.some(k => k.toLowerCase().includes(term))
      )
    );
  }

  clear() {
    this.memories = [];
  }
}