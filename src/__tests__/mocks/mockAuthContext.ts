import { AuthContextType } from '@/types/auth';
import { ActorSubclass } from '@dfinity/agent';
import { Identity } from '@dfinity/identity';
import { Principal } from '@dfinity/principal';
import { _SERVICE } from '@/declarations/anima/anima.did';
import { jest } from '@jest/globals';

export const mockIdentity = {
    getPrincipal: () => Principal.fromText('2vxsx-fae'),
} as Identity;

export const mockActor = {
    get_payment_amount: jest.fn(),
    verify_payment: jest.fn(),
    get_principal: jest.fn(),
    get_user_state: jest.fn(),
    create_anima: jest.fn(),
    get_anima_state: jest.fn(),
    get_anima_metrics: jest.fn(),
    get_health_status: jest.fn(),
    get_canister_metrics: jest.fn(),
    get_system_metrics: jest.fn(),
} as unknown as ActorSubclass<_SERVICE>;

export const mockAuthContext: AuthContextType = {
    identity: mockIdentity,
    principal: mockIdentity.getPrincipal(),
    actor: mockActor,
    isInitialized: true,
    isAuthenticated: true,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    shouldAutoConnect: true,
};

export const mockErrorAuthContext: AuthContextType = {
    ...mockAuthContext,
    error: 'Authentication failed',
    isAuthenticated: false,
};

export const createMockAuthContext = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
    ...mockAuthContext,
    ...overrides,
});