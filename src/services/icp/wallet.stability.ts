import { WalletQuantumMetrics, StabilityCheckResult, StabilityRecommendation, WalletEventEmitter } from '../../types/wallet';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '../error-tracker';

export class WalletStabilityMonitor {
    private static instance: WalletStabilityMonitor | null = null;
    private errorTracker: ErrorTracker;
    private stabilityHistory: WalletQuantumMetrics[] = [];
    private readonly MAX_HISTORY_SIZE = 100;
    private readonly STABILITY_THRESHOLD = 0.7;
    private readonly COHERENCE_THRESHOLD = 0.65;
    private readonly ENTANGLEMENT_THRESHOLD = 0.4;

    private constructor() {
        this.errorTracker = ErrorTracker.getInstance();
    }

    public static getInstance(): WalletStabilityMonitor {
        if (!WalletStabilityMonitor.instance) {
            WalletStabilityMonitor.instance = new WalletStabilityMonitor();
        }
        return WalletStabilityMonitor.instance;
    }

    public checkStability(currentMetrics: WalletQuantumMetrics): StabilityCheckResult {
        this.updateHistory(currentMetrics);

        const isStable = this.isMetricsStable(currentMetrics);
        const recommendations = this.generateRecommendations(currentMetrics);
        const canProceed = this.canProceedWithTransactions(currentMetrics);

        if (!isStable) {
            this.errorTracker.trackError({
                type: 'WalletStabilityWarning',
                category: ErrorCategory.System,
                severity: ErrorSeverity.Medium,
                message: 'Wallet stability below threshold',
                timestamp: new Date(),
                context: { metrics: currentMetrics }
            });
        }

        return {
            isStable,
            currentMetrics,
            recommendations,
            canProceed
        };
    }

    private isMetricsStable(metrics: WalletQuantumMetrics): boolean {
        return metrics.stabilityIndex >= this.STABILITY_THRESHOLD &&
               metrics.coherenceLevel >= this.COHERENCE_THRESHOLD &&
               metrics.entanglementFactor <= this.ENTANGLEMENT_THRESHOLD;
    }

    private canProceedWithTransactions(metrics: WalletQuantumMetrics): boolean {
        return metrics.stabilityStatus !== 'critical' &&
               metrics.coherenceLevel > this.COHERENCE_THRESHOLD / 2;
    }

    private generateRecommendations(metrics: WalletQuantumMetrics): StabilityRecommendation[] {
        const recommendations: StabilityRecommendation[] = [];

        if (metrics.coherenceLevel < this.COHERENCE_THRESHOLD) {
            recommendations.push({
                type: 'coherence_boost',
                priority: 1,
                expectedImpact: 0.8,
                timeToImplement: 5000 // 5 seconds
            });
        }

        if (metrics.stabilityIndex < this.STABILITY_THRESHOLD) {
            recommendations.push({
                type: 'quantum_realignment',
                priority: 2,
                expectedImpact: 0.6,
                timeToImplement: 8000 // 8 seconds
            });
        }

        if (metrics.entanglementFactor > this.ENTANGLEMENT_THRESHOLD) {
            recommendations.push({
                type: 'entanglement_reset',
                priority: 3,
                expectedImpact: 0.4,
                timeToImplement: 3000 // 3 seconds
            });
        }

        return recommendations.sort((a, b) => a.priority - b.priority);
    }

    private updateHistory(metrics: WalletQuantumMetrics): void {
        this.stabilityHistory.push(metrics);
        if (this.stabilityHistory.length > this.MAX_HISTORY_SIZE) {
            this.stabilityHistory.shift();
        }
    }

    public getStabilityTrend(): number {
        if (this.stabilityHistory.length < 2) return 1;

        const recentMetrics = this.stabilityHistory.slice(-10);
        let trend = 0;

        for (let i = 1; i < recentMetrics.length; i++) {
            const current = recentMetrics[i].stabilityIndex;
            const previous = recentMetrics[i-1].stabilityIndex;
            trend += current - previous;
        }

        return trend / (recentMetrics.length - 1);
    }

    public async stabilizeWallet(
        currentMetrics: WalletQuantumMetrics,
        eventEmitter: WalletEventEmitter
    ): Promise<boolean> {
        const recommendations = this.generateRecommendations(currentMetrics);
        
        for (const rec of recommendations) {
            eventEmitter.emit('recovery_started', { recommendation: rec });
            
            try {
                await this.applyRecommendation(rec, eventEmitter);
                eventEmitter.emit('recovery_completed', { 
                    success: true,
                    recommendation: rec 
                });
            } catch (error) {
                this.errorTracker.trackError({
                    type: 'StabilizationFailed',
                    category: ErrorCategory.System,
                    severity: ErrorSeverity.High,
                    message: `Failed to apply ${rec.type}`,
                    timestamp: new Date(),
                    context: { recommendation: rec }
                });
                return false;
            }
        }

        return true;
    }

    private async applyRecommendation(
        recommendation: StabilityRecommendation,
        eventEmitter: WalletEventEmitter
    ): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, recommendation.timeToImplement));
        eventEmitter.emit('quantum_shift', { type: recommendation.type });
    }
}