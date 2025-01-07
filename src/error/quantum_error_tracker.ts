import { ErrorTracker, ErrorSeverity, ErrorTracking } from './quantum_error';
import { QuantumState, StabilityCheckpoint } from '../quantum/types';

export interface QuantumErrorContext {
    operation: string;
    principal?: string;
    quantumState?: Partial<QuantumState>;
    stabilityCheckpoint?: StabilityCheckpoint;
    recoveryAttempts?: number;
    lastStabilityUpdate?: number;
    params?: Record<string, any>;
}

export interface QuantumErrorTracking extends ErrorTracking {
    quantumContext: QuantumErrorContext;
}

export class QuantumErrorTracker extends ErrorTracker {
    private static instance: QuantumErrorTracker;
    private quantumErrors: QuantumErrorTracking[] = [];
    private readonly MAX_QUANTUM_ERRORS = 50;

    private constructor() {
        super();
    }

    static getInstance(): QuantumErrorTracker {
        if (!QuantumErrorTracker.instance) {
            QuantumErrorTracker.instance = new QuantumErrorTracker();
        }
        return QuantumErrorTracker.instance;
    }

    async trackQuantumError(params: {
        errorType: string;
        severity: ErrorSeverity;
        context: QuantumErrorContext;
        error: Error;
        quantumState?: Partial<QuantumState>;
        stabilityCheckpoint?: StabilityCheckpoint;
    }): Promise<void> {
        const errorTracking: QuantumErrorTracking = {
            errorType: params.errorType,
            severity: params.severity,
            context: JSON.stringify(params.context),
            error: params.error,
            timestamp: Date.now(),
            quantumContext: {
                ...params.context,
                quantumState: params.quantumState,
                stabilityCheckpoint: params.stabilityCheckpoint
            }
        };

        this.quantumErrors.unshift(errorTracking);

        if (this.quantumErrors.length > this.MAX_QUANTUM_ERRORS) {
            this.quantumErrors = this.quantumErrors.slice(0, this.MAX_QUANTUM_ERRORS);
        }

        // Log quantum-specific error details
        console.error(`[${params.severity}] QUANTUM_ERROR:`, {
            context: params.context,
            error: params.error,
            quantumState: params.quantumState,
            stabilityCheckpoint: params.stabilityCheckpoint
        });

        // Also track in base error tracker
        await super.trackError({
            errorType: params.errorType,
            severity: params.severity,
            context: params.context,
            error: params.error
        });
    }

    getRecentQuantumErrors(count: number = 10): QuantumErrorTracking[] {
        return this.quantumErrors.slice(0, count);
    }

    async analyzeQuantumErrors(): Promise<{
        criticalErrorCount: number;
        stabilityIssues: number;
        recoveryAttempts: number;
        mostCommonError: string;
        recommendations: string[];
    }> {
        const criticalErrors = this.quantumErrors.filter(e => e.severity === 'CRITICAL');
        const stabilityErrors = this.quantumErrors.filter(e => 
            e.quantumContext.operation.includes('stability'));
        
        const errorTypes = this.quantumErrors.reduce((acc, curr) => {
            acc[curr.errorType] = (acc[curr.errorType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostCommonError = Object.entries(errorTypes)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';

        const recommendations = this.generateRecommendations(
            criticalErrors.length,
            stabilityErrors.length,
            mostCommonError
        );

        return {
            criticalErrorCount: criticalErrors.length,
            stabilityIssues: stabilityErrors.length,
            recoveryAttempts: this.countRecoveryAttempts(),
            mostCommonError,
            recommendations
        };
    }

    private countRecoveryAttempts(): number {
        return this.quantumErrors.filter(e => 
            e.quantumContext.operation === 'quantum_recovery').length;
    }

    private generateRecommendations(
        criticalCount: number,
        stabilityIssues: number,
        commonError: string
    ): string[] {
        const recommendations: string[] = [];

        if (criticalCount > 5) {
            recommendations.push('Consider quantum field reinitialization');
        }

        if (stabilityIssues > 10) {
            recommendations.push('Review stability update frequency');
            recommendations.push('Check quantum coherence thresholds');
        }

        if (this.countRecoveryAttempts() > 20) {
            recommendations.push('Implement exponential backoff for recovery attempts');
        }

        return recommendations;
    }

    clearQuantumErrors(): void {
        this.quantumErrors = [];
    }

    getQuantumErrorCount(): number {
        return this.quantumErrors.length;
    }
}

export const quantumErrorTracker = QuantumErrorTracker.getInstance();