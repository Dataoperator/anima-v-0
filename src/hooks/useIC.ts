import { useState, useEffect } from 'react';
import { Identity, HttpAgent } from "@dfinity/agent";
import { icManager } from '../ic-init';
import type { _SERVICE } from "../declarations/anima/anima.did";

interface ICHookResult {
  actor: _SERVICE | null;
  identity: Identity | null;
  agent: HttpAgent | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  error: Error | null;
}

export function useIC(): ICHookResult {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [actor, setActor] = useState<_SERVICE | null>(null);

  useEffect(() => {
    const initIC = async () => {
      try {
        if (!icManager.isInitialized()) {
          await icManager.initialize();
        }
        
        const identity = icManager.getIdentity();
        const isAnon = identity?.getPrincipal().isAnonymous() ?? true;
        
        setIsAuthenticated(!isAnon);
        setIsAnonymous(isAnon);
        setActor(icManager.getActor<_SERVICE>());
        setError(null);
      } catch (err) {
        setError(err as Error);
        setIsAuthenticated(false);
        setIsAnonymous(true);
        setActor(null);
      }
    };

    initIC();
  }, []);

  const login = async (): Promise<boolean> => {
    try {
      const success = await icManager.login();
      if (success) {
        setIsAuthenticated(true);
        setIsAnonymous(false);
        setActor(icManager.getActor<_SERVICE>());
      }
      return success;
    } catch (err) {
      setError(err as Error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await icManager.logout();
      setIsAuthenticated(false);
      setIsAnonymous(true);
      // Update actor with anonymous identity
      setActor(icManager.getActor<_SERVICE>());
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    actor,
    identity: icManager.getIdentity(),
    agent: icManager.getAgent(),
    isAuthenticated,
    isAnonymous,
    login,
    logout,
    error
  };
}