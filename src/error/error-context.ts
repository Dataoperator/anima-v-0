import { QuantumState, ResonancePattern } from '../quantum/types';

export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ErrorContext {
    operation: string;
    principal?: string;
    timestamp?: number;
    quantumState?: Partial<QuantumState>;
    resonancePatterns?: ResonancePattern[];
    params?: Record<string, any>;
    recoveryAttempt?: number;
    lastStabilityUpdate?: number;
}

export interface ErrorTracking {
    id: string;
    errorType: string;
    severity: ErrorSeverity;
    context: ErrorContext;
    error: Error;
    timestamp: number;
    recovered?: boolean;
    recoveryTimestamp?: number;
    recoveryAttempts?: number;
    stackTrace?: string;
    systemState?: {
        memory: number;
        cpu: number;
        networkLatency: number;
    };
}

export enum ErrorType {
    // Quantum State Errors
    QUANTUM_INITIALIZATION = 'QUANTUM_INITIALIZATION',
    QUANTUM_STABILITY = 'QUANTUM_STABILITY',
    QUANTUM_COHERENCE = 'QUANTUM_COHERENCE',
    QUANTUM_MEASUREMENT = 'QUANTUM_MEASUREMENT',
    QUANTUM_ENTANGLEMENT = 'QUANTUM_ENTANGLEMENT',
    
    // Neural Pattern Errors
    PATTERN_GENERATION = 'PATTERN_GENERATION',
    PATTERN_CORRUPTION = 'PATTERN_CORRUPTION',
    PATTERN_EVOLUTION = 'PATTERN_EVOLUTION',
    
    // State Management Errors
    STATE_TRANSITION = 'STATE_TRANSITION',
    STATE_CORRUPTION = 'STATE_CORRUPTION',
    STATE_SYNCHRONIZATION = 'STATE_SYNCHRONIZATION',
    
    // Actor Errors
    ACTOR_CREATION = 'ACTOR_CREATION',
    ACTOR_METHOD = 'ACTOR_METHOD',
    ACTOR_RESPONSE = 'ACTOR_RESPONSE',
    
    // Authentication Errors
    AUTH_INITIALIZATION = 'AUTH_INITIALIZATION',
    AUTH_PRINCIPAL = 'AUTH_PRINCIPAL',
    AUTH_IDENTITY = 'AUTH_IDENTITY',
    
    // Wallet Errors
    WALLET_INITIALIZATION = 'WALLET_INITIALIZATION',
    WALLET_BALANCE = 'WALLET_BALANCE',
    WALLET_TRANSACTION = 'WALLET_TRANSACTION',
    WALLET_ADDRESS = 'WALLET_ADDRESS',
    
    // System Errors
    NETWORK = 'NETWORK',
    MEMORY = 'MEMORY',
    TIMEOUT = 'TIMEOUT',
    UNEXPECTED = 'UNEXPECTED'
}

export const getErrorSeverity = (errorType: ErrorType): ErrorSeverity => {
    switch (errorType) {
        case ErrorType.QUANTUM_INITIALIZATION:
        case ErrorType.QUANTUM_STABILITY:
        case ErrorType.QUANTUM_COHERENCE:
        case ErrorType.STATE_CORRUPTION:
        case ErrorType.WALLET_INITIALIZATION:
            return 'CRITICAL';
            
        case ErrorType.PATTERN_CORRUPTION:
        case ErrorType.ACTOR_CREATION:
        case ErrorType.AUTH_INITIALIZATION:
        case ErrorType.WALLET_TRANSACTION:
            return 'HIGH';
            
        case ErrorType.PATTERN_EVOLUTION:
        case ErrorType.STATE_SYNCHRONIZATION:
        case ErrorType.ACTOR_METHOD:
        case ErrorType.WALLET_BALANCE:
            return 'MEDIUM';
            
        default:
            return 'LOW';
    }
};

export const createErrorContext = (
    operation: string,
    params?: Record<string, any>,
    state?: Partial<QuantumState>
): ErrorContext => ({
    operation,
    timestamp: Date.now(),
    params,
    quantumState: state,
});

export const formatError = (error: Error, context: ErrorContext): string => {
    const timestamp = new Date().toISOString();
    const contextString = JSON.stringify(context, null, 2);
    return `[${timestamp}] Error in ${context.operation}:
    Message: ${error.message}
    Stack: ${error.stack}
    Context: ${contextString}`;
};