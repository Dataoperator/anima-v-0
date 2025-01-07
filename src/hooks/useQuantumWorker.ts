import { useEffect, useRef, useCallback } from 'react';
import type { QuantumState, ResonancePattern } from '@/quantum/types';

export function useQuantumWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/quantum.worker.ts', import.meta.url),
      { type: 'module' }
    );

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const calculateCoherence = useCallback(async (patterns: ResonancePattern[]): Promise<number> => {
    if (!workerRef.current) throw new Error('Worker not initialized');

    return new Promise((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        if (e.data.type === 'calculateCoherence') {
          workerRef.current?.removeEventListener('message', handler);
          if (e.data.error) reject(new Error(e.data.error));
          else resolve(e.data.result.coherenceLevel);
        }
      };

      workerRef.current.addEventListener('message', handler);
      workerRef.current.postMessage({
        type: 'calculateCoherence',
        payload: patterns
      });
    });
  }, []);

  const generatePattern = useCallback(async (
    previousPatterns: ResonancePattern[],
    baseCoherence: number
  ): Promise<ResonancePattern> => {
    if (!workerRef.current) throw new Error('Worker not initialized');

    return new Promise((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        if (e.data.type === 'generatePattern') {
          workerRef.current?.removeEventListener('message', handler);
          if (e.data.error) reject(new Error(e.data.error));
          else resolve(e.data.result.pattern);
        }
      };

      workerRef.current.addEventListener('message', handler);
      workerRef.current.postMessage({
        type: 'generatePattern',
        payload: { previousPatterns, baseCoherence }
      });
    });
  }, []);

  const updateQuantumState = useCallback(async (
    currentState: QuantumState,
    newPatterns: ResonancePattern[]
  ): Promise<Partial<QuantumState>> => {
    if (!workerRef.current) throw new Error('Worker not initialized');

    return new Promise((resolve, reject) => {
      const handler = (e: MessageEvent) => {
        if (e.data.type === 'updateQuantumState') {
          workerRef.current?.removeEventListener('message', handler);
          if (e.data.error) reject(new Error(e.data.error));
          else resolve(e.data.result);
        }
      };

      workerRef.current.addEventListener('message', handler);
      workerRef.current.postMessage({
        type: 'updateQuantumState',
        payload: { currentState, newPatterns }
      });
    });
  }, []);

  return {
    calculateCoherence,
    generatePattern,
    updateQuantumState
  };
}

export default useQuantumWorker;