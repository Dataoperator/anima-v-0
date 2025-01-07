import { Actor } from '@dfinity/agent';
import { RealtimeUpdate, PersonalityMetrics, WebSocketError } from '@/types/realtime';

type UpdateCallback = (update: RealtimeUpdate) => void;

export class RealtimeService {
    private actor: Actor;
    private subscriptions: Map<string, Set<UpdateCallback>>;
    private heartbeatInterval: number | null;
    private reconnectAttempts: number;
    private quantumState: 'stable' | 'superposition' | 'entangled';
    private readonly MAX_RECONNECT_ATTEMPTS = 5;

    constructor(actor: Actor) {
        this.actor = actor;
        this.subscriptions = new Map();
        this.heartbeatInterval = null;
        this.reconnectAttempts = 0;
        this.quantumState = 'stable';
    }

    async subscribe(animaId: string, callback: UpdateCallback): Promise<void> {
        try {
            // Check quantum state before subscription
            if (this.quantumState !== 'stable') {
                throw new Error(`quantum_error: System in ${this.quantumState} state`);
            }

            if (!this.subscriptions.has(animaId)) {
                this.subscriptions.set(animaId, new Set());
                await this.initializeSubscription(animaId);
            }

            this.subscriptions.get(animaId)?.add(callback);
            this.startHeartbeat();

        } catch (error) {
            if (error instanceof Error && error.message.includes('quantum')) {
                this.handleQuantumError(error);
            }
            throw error;
        }
    }

    private handleQuantumError(error: Error) {
        const errorType = error.message.split(':')[0];
        switch (errorType) {
            case 'quantum_superposition':
                this.quantumState = 'superposition';
                this.attemptStateCollapse();
                break;
            case 'quantum_entanglement':
                this.quantumState = 'entangled';
                this.resolveEntanglement();
                break;
            default:
                throw error;
        }
    }

    private async attemptStateCollapse() {
        console.log('Attempting quantum state collapse...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.quantumState = 'stable';
        this.reconnectAll();
    }

    private async resolveEntanglement() {
        console.log('Resolving quantum entanglement...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.quantumState = 'stable';
        this.reconnectAll();
    }

    private async reconnectAll() {
        for (const [animaId, callbacks] of this.subscriptions.entries()) {
            await this.initializeSubscription(animaId);
            for (const callback of callbacks) {
                callback({ type: 'RECONNECTED', data: null });
            }
        }
    }

    unsubscribe(animaId: string) {
        this.subscriptions.delete(animaId);
        if (this.subscriptions.size === 0) {
            this.stopHeartbeat();
        }
    }

    private startHeartbeat() {
        if (!this.heartbeatInterval) {
            this.heartbeatInterval = window.setInterval(() => this.sendHeartbeat(), 30000);
        }
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    private async sendHeartbeat() {
        try {
            const metrics = await this.actor.get_personality_metrics();
            for (const [animaId, callbacks] of this.subscriptions.entries()) {
                for (const callback of callbacks) {
                    callback({
                        type: 'UPDATE',
                        data: metrics[animaId] || null
                    });
                }
            }
            this.reconnectAttempts = 0;
        } catch (error) {
            this.handleHeartbeatError(error);
        }
    }

    private async handleHeartbeatError(error: any) {
        if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            this.stopHeartbeat();
            for (const callbacks of this.subscriptions.values()) {
                for (const callback of callbacks) {
                    callback({
                        type: 'ERROR',
                        error: {
                            code: 500,
                            message: 'Maximum reconnection attempts reached'
                        }
                    });
                }
            }
            return;
        }

        this.reconnectAttempts++;
        console.log(`Reconnection attempt ${this.reconnectAttempts}...`);
        
        await new Promise(resolve => setTimeout(resolve, 2000 * this.reconnectAttempts));
        this.sendHeartbeat();
    }

    private async initializeSubscription(animaId: string): Promise<void> {
        try {
            const metrics = await this.actor.get_personality_metrics();
            const callbacks = this.subscriptions.get(animaId);
            if (callbacks) {
                for (const callback of callbacks) {
                    callback({
                        type: 'CONNECTED',
                        data: metrics[animaId] || null
                    });
                }
            }
        } catch (error) {
            console.error('Failed to initialize subscription:', error);
            throw error;
        }
    }
}