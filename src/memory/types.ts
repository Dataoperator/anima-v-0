export interface Memory {
  id: string;
  timestamp: number;
  importance: number;
  description: string;
  keywords: string[];
  quantumResonance: number;
  emotionalDepth: number;
}

export interface MemorySnapshot {
  memories: Memory[];
  lastSyncTimestamp: number;
  totalImportance: number;
  averageResonance: number;
}