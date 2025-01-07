import { ActorSubclass } from '@dfinity/agent';
import type { Ed25519KeyIdentity } from '@dfinity/identity';
import { Principal } from '@dfinity/principal';
import { _SERVICE } from '@/declarations/anima/anima.did';

export type Identity = Ed25519KeyIdentity;

export interface AuthState {
    identity: Identity | null;
    principal: Principal | null;
    isAuthenticated: boolean;
    error: string | null;
}

export interface AuthContextType {
    identity: Identity | null;
    principal: Principal | null;
    actor: ActorSubclass<_SERVICE> | null;
    isInitialized: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: () => Promise<void>;
    logout: () => void;
    shouldAutoConnect: boolean;
    toggleAutoConnect: () => void;
}