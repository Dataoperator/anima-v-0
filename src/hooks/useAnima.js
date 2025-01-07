import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export const useAnima = () => {
  const { identity, actor } = useAuth();
  const [animas, setAnimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAnima, setActiveAnima] = useState(null);

  const fetchUserAnimas = useCallback(async () => {
    if (!actor || !identity) return;
    
    try {
      setLoading(true);
      const principal = identity.getPrincipal();
      const userAnimas = await actor.get_user_animas(principal);
      setAnimas(userAnimas);
      return userAnimas;
    } catch (err) {
      console.error('Error fetching animas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [actor, identity]);

  const getAnima = useCallback(async (id) => {
    if (!actor) return null;
    
    try {
      const anima = await actor.get_anima(id);
      setActiveAnima(anima);
      return anima;
    } catch (err) {
      console.error('Error fetching anima:', err);
      setError(err.message);
      return null;
    }
  }, [actor]);

  const createAnima = useCallback(async () => {
    if (!actor || !identity) return null;
    
    try {
      setLoading(true);
      const anima = await actor.create_anima();
      await fetchUserAnimas(); // Refresh list
      return anima;
    } catch (err) {
      console.error('Error creating anima:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [actor, identity, fetchUserAnimas]);

  useEffect(() => {
    fetchUserAnimas();
  }, [fetchUserAnimas]);

  return {
    animas,
    activeAnima,
    loading,
    error,
    fetchUserAnimas,
    getAnima,
    createAnima,
    actor
  };
};