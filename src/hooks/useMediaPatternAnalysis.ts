import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuantumPerception } from './useQuantumPerception';
import { useQuantumState } from './useQuantumState';
import { MediaPattern, MediaAnalysisState, PatternCache, QuantumContext } from '../types/media';

const PATTERN_CACHE_SIZE = 1000;
const PATTERN_EVOLUTION_INTERVAL = 5000;
const MAX_PATTERNS = 50;
const MAX_CONTEXT_ITEMS = 20;

export const useMediaPatternAnalysis = (mediaUrl?: string) => {
  const { processMediaInteraction, getTemporalQuantumContext } = useQuantumPerception();
  const { quantumState } = useQuantumState();
  const patternCache = useRef<PatternCache>(new Map());
  const [analysisState, setAnalysisState] = useState<MediaAnalysisState>({
    currentPatterns: [],
    temporalContext: [],
    understanding: {
      concepts: [],
      emotions: [],
      context: []
    },
    quantumResonance: 0,
    patternEvolution: {
      stage: 0,
      confidence: 0,
      lastUpdate: Date.now()
    }
  });

  const getCachedPattern = useCallback((signature: string): MediaPattern | undefined => {
    return patternCache.current.get(signature);
  }, []);

  const cachePattern = useCallback((pattern: MediaPattern) => {
    if (patternCache.current.size >= PATTERN_CACHE_SIZE) {
      const oldestKey = Array.from(patternCache.current.keys())[0];
      patternCache.current.delete(oldestKey);
    }
    patternCache.current.set(pattern.signature, pattern);
  }, []);

  const generatePatternSignature = useCallback((data: ImageData | AudioBuffer, timestamp: number): string => {
    return `${data.toString().slice(0, 100)}-${timestamp}`;
  }, []);

  const calculatePatternConfidence = useCallback((pattern: MediaPattern, quantumContext: QuantumContext): number => {
    const baseConfidence = pattern.confidence;
    const quantumBoost = quantumContext.resonance * 0.2;
    const temporalFactor = Math.exp(-(Date.now() - pattern.timestamp) / 10000);
    
    return Math.min(1, (baseConfidence + quantumBoost) * temporalFactor);
  }, []);

  const processVideoFrame = useCallback(async (frameData: ImageData) => {
    try {
      const timestamp = Date.now();
      const quantumContext = getTemporalQuantumContext(timestamp);
      const signature = generatePatternSignature(frameData, timestamp);
      
      let visualPattern = getCachedPattern(signature);
      
      if (!visualPattern) {
        visualPattern = {
          type: 'visual',
          signature,
          confidence: calculatePatternConfidence({ 
            type: 'visual',
            confidence: 0.5,
            markers: ['motion', 'objects', 'scene'],
            timestamp,
            quantumSignature: [quantumContext.resonance, quantumContext.coherence],
            signature
          }, quantumContext),
          markers: ['motion', 'objects', 'scene'],
          timestamp,
          quantumSignature: [quantumContext.resonance, quantumContext.coherence]
        };
        cachePattern(visualPattern);
      }

      setAnalysisState(prev => ({
        ...prev,
        currentPatterns: [...prev.currentPatterns, visualPattern!].slice(-MAX_PATTERNS),
        temporalContext: updateTemporalContext(prev.temporalContext, visualPattern!),
        understanding: {
          concepts: updateConcepts(prev.understanding.concepts, visualPattern!),
          emotions: updateEmotions(prev.understanding.emotions, visualPattern!),
          context: updateContext(prev.understanding.context, visualPattern!)
        },
        quantumResonance: quantumContext.resonance,
        patternEvolution: evolvePatternStage(prev.patternEvolution, visualPattern!)
      }));

      await processMediaInteraction({
        type: 'video',
        pattern: visualPattern,
        timestamp,
        quantumContext
      });

    } catch (error) {
      console.error('Error processing video frame:', error);
      throw new Error(`Video frame processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [getTemporalQuantumContext, processMediaInteraction, generatePatternSignature, getCachedPattern, cachePattern, calculatePatternConfidence]);

  const processAudioSegment = useCallback(async (audioData: AudioBuffer) => {
    try {
      const timestamp = Date.now();
      const quantumContext = getTemporalQuantumContext(timestamp);
      const signature = generatePatternSignature(audioData, timestamp);
      
      let audioPattern = getCachedPattern(signature);
      
      if (!audioPattern) {
        audioPattern = {
          type: 'audio',
          signature,
          confidence: calculatePatternConfidence({
            type: 'audio',
            confidence: 0.5,
            markers: ['speech', 'music', 'ambient'],
            timestamp,
            quantumSignature: [quantumContext.resonance, quantumContext.coherence],
            signature
          }, quantumContext),
          markers: ['speech', 'music', 'ambient'],
          timestamp,
          quantumSignature: [quantumContext.resonance, quantumContext.coherence]
        };
        cachePattern(audioPattern);
      }

      setAnalysisState(prev => ({
        ...prev,
        currentPatterns: [...prev.currentPatterns, audioPattern!].slice(-MAX_PATTERNS),
        understanding: {
          ...prev.understanding,
          concepts: updateConcepts(prev.understanding.concepts, audioPattern!),
          emotions: updateEmotions(prev.understanding.emotions, audioPattern!)
        },
        patternEvolution: evolvePatternStage(prev.patternEvolution, audioPattern!)
      }));

      await processMediaInteraction({
        type: 'audio',
        pattern: audioPattern,
        timestamp,
        quantumContext
      });

    } catch (error) {
      console.error('Error processing audio segment:', error);
      throw new Error(`Audio segment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [getTemporalQuantumContext, processMediaInteraction, generatePatternSignature, getCachedPattern, cachePattern, calculatePatternConfidence]);

  const evolvePatternStage = (currentEvolution: {stage: number, confidence: number, lastUpdate: number}, pattern: MediaPattern) => {
    const timeDelta = Date.now() - currentEvolution.lastUpdate;
    const confidenceGrowth = pattern.confidence * 0.1;
    const newConfidence = Math.min(1, currentEvolution.confidence + confidenceGrowth);
    
    let newStage = currentEvolution.stage;
    if (newConfidence > (currentEvolution.stage + 1) * 0.2) {
      newStage++;
    }

    return {
      stage: newStage,
      confidence: newConfidence,
      lastUpdate: Date.now()
    };
  };

  const updateTemporalContext = (currentContext: string[], pattern: MediaPattern): string[] => {
    const newContext = [...new Set([...currentContext, ...pattern.markers])];
    return newContext.slice(-MAX_CONTEXT_ITEMS);
  };

  const updateConcepts = (currentConcepts: string[], pattern: MediaPattern): string[] => {
    const newConcepts = [...new Set([...currentConcepts, ...pattern.markers])];
    return newConcepts.filter(concept => {
      const conceptPatterns = analysisState.currentPatterns.filter(p => 
        p.markers.includes(concept)
      ).length;
      return conceptPatterns >= 2;
    });
  };

  const updateEmotions = (currentEmotions: string[], pattern: MediaPattern): string[] => {
    const emotionMarkers = pattern.markers.filter(marker => 
      marker.startsWith('emotion_')
    );
    return [...new Set([...currentEmotions, ...emotionMarkers])];
  };

  const updateContext = (currentContext: string[], pattern: MediaPattern): string[] => {
    return [...new Set([...currentContext, ...pattern.markers])].slice(-MAX_CONTEXT_ITEMS);
  };

  useEffect(() => {
    if (!mediaUrl) return;

    const evolvePatterns = () => {
      const quantumBoost = quantumState?.resonance ?? 0;
      const currentTime = Date.now();
      
      setAnalysisState(prev => ({
        ...prev,
        currentPatterns: prev.currentPatterns.map(pattern => ({
          ...pattern,
          confidence: calculatePatternConfidence(pattern, {
            resonance: quantumBoost,
            coherence: quantumState?.coherenceLevel ?? 0,
            timestamp: currentTime
          })
        }))
      }));
    };

    const evolutionInterval = setInterval(evolvePatterns, PATTERN_EVOLUTION_INTERVAL);
    return () => clearInterval(evolutionInterval);
  }, [mediaUrl, quantumState, calculatePatternConfidence]);

  return {
    analysisState,
    processVideoFrame,
    processAudioSegment,
    patternCache: patternCache.current
  };
};

export default useMediaPatternAnalysis;