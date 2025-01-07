import React, { useEffect, useRef } from 'react';
import { useQuantumState } from '@/hooks/useQuantumState';

// Separate the class into its own module for cleaner organization
const createDataStream = (updateCallback) => {
  let isActive = false;
  let buffer = [];
  let processInterval = null;
  const maxBufferSize = 1000;

  const start = () => {
    if (isActive) return;
    isActive = true;
    processInterval = setInterval(() => processBuffer(), 100);
  };

  const stop = () => {
    isActive = false;
    if (processInterval) {
      clearInterval(processInterval);
      processInterval = null;
    }
  };

  const pushData = (data) => {
    if (!isActive) return;
    buffer.push({
      timestamp: Date.now(),
      data
    });
    
    if (buffer.length > maxBufferSize) {
      buffer.shift();
    }
  };

  const processBuffer = () => {
    if (!isActive || buffer.length === 0) return;
    
    const currentTime = Date.now();
    const relevantData = buffer.filter(
      item => currentTime - item.timestamp < 5000
    );
    
    if (relevantData.length > 0) {
      const averagedData = averageQuantumData(relevantData);
      updateCallback(averagedData);
    }
    
    // Clean old data
    buffer = buffer.filter(
      item => currentTime - item.timestamp < 5000
    );
  };

  const averageQuantumData = (dataPoints) => 
    dataPoints.reduce((acc, { data }) => ({
      coherence: acc.coherence + data.coherence / dataPoints.length,
      dimensional_frequency: acc.dimensional_frequency + data.dimensional_frequency / dataPoints.length,
      entanglement_count: Math.max(acc.entanglement_count, data.entanglement_count),
      superposition_count: Math.max(acc.superposition_count, data.superposition_count),
      quantum_memory_depth: Math.max(acc.quantum_memory_depth, data.quantum_memory_depth)
    }), {
      coherence: 0,
      dimensional_frequency: 0,
      entanglement_count: 0,
      superposition_count: 0,
      quantum_memory_depth: 0
    });

  return {
    start,
    stop,
    pushData,
  };
};

const DataStreamComponent = ({ animaId, onDataUpdate }) => {
  const streamRef = useRef(null);
  const { getMetrics } = useQuantumState(animaId);
  
  useEffect(() => {
    // Create the stream instance
    streamRef.current = createDataStream(onDataUpdate);
    streamRef.current.start();
    
    // Set up the data fetching interval
    const fetchInterval = setInterval(async () => {
      if (streamRef.current) {
        const metrics = await getMetrics();
        if (metrics) {
          streamRef.current.pushData(metrics);
        }
      }
    }, 1000);
    
    // Cleanup
    return () => {
      clearInterval(fetchInterval);
      if (streamRef.current) {
        streamRef.current.stop();
      }
    };
  }, [animaId, getMetrics, onDataUpdate]);
  
  return null;
};

export { DataStreamComponent, createDataStream as DataStream };