import { useState, useEffect, useCallback } from 'react';
import { Principal } from '@dfinity/principal';

const SESSION_KEY = 'anima_session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useSession = () => {
  const [session, setSession] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const saveSession = useCallback((data) => {
    const sessionData = {
      ...data,
      timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    setSession(sessionData);
    setLastActivity(Date.now());
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const checkSession = useCallback(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return null;

      const sessionData = JSON.parse(stored);
      const elapsed = Date.now() - sessionData.timestamp;

      if (elapsed > SESSION_TIMEOUT) {
        clearSession();
        return null;
      }

      // Convert principal back to proper type if exists
      if (sessionData.principal) {
        sessionData.principal = Principal.fromText(sessionData.principal);
      }

      return sessionData;
    } catch (error) {
      console.error('Session check failed:', error);
      clearSession();
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    // Initial session check
    const currentSession = checkSession();
    if (currentSession) {
      setSession(currentSession);
    }

    // Activity monitoring
    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    // Session monitoring
    const sessionInterval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime > SESSION_TIMEOUT) {
        clearSession();
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearInterval(sessionInterval);
    };
  }, [checkSession, clearSession, lastActivity]);

  return {
    session,
    saveSession,
    clearSession,
    checkSession,
  };
};

export default useSession;