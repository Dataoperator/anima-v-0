import { useState, useEffect, useRef } from 'react';
import { useQuantumState } from './useQuantumState';

const useQuantumDataStream = (animaId) => {
  const [metrics, setMetrics] = useState(null);
  const bufferRef = useRef([]);
  const { getMetrics } = useQuantumState(animaId);
  const processingRef = useRef(null);

  const processBuffer = () => {
    const currentTime = Date.now();
    const relevantData = bufferRef.current.filter(
      item => currentTime - item.timestamp < 5000
    );

    if (relevantData.length > 0) {
      const averagedData = relevantData.reduce((acc, { data }) => ({
        coherence: acc.coherence + data.coherence / relevantData.length,
        dimensional_frequency: acc.dimensional_frequency + data.dimensional_frequency / relevantData.length,
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

      setMetrics(prev => {
        if (!prev) return averagedData;
        return {
          ...averagedData,
          coherence: prev.coherence * 0.8 + averagedData.coherence * 0.2,
          dimensional_frequency: prev.dimensional_frequency * 0.8 + averagedData.dimensional_frequency * 0.2
        };
      });
    }

    // Clean old data
    bufferRef.current = bufferRef.current.filter(
      item => currentTime - item.timestamp < 5000
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMetrics();
      if (data) {
        bufferRef.current.push({
          timestamp: Date.now(),
          data
        });

        if (bufferRef.current.length > 1000) {
          bufferRef.current.shift();
        }
      }
    };

    // Start processing
    processingRef.current = setInterval(processBuffer, 100);
    
    // Start data fetching
    const fetchInterval = setInterval(fetchData, 1000);

    return () => {
      clearInterval(processingRef.current);
      clearInterval(fetchInterval);
      bufferRef.current = [];
    };
  }, [getMetrics]);

  return metrics;
};

export default useQuantumDataStream;