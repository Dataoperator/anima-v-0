import type { 
    RealtimeConnection,
    RealtimeMessage, 
    WebSocketState,
    SubscriptionOptions,
    RealtimeEventHandler,
    UpdateMode,
    WebSocketError
} from '@/types/realtime';
import { UpdateType } from '@/types/realtime';

const DEFAULT_OPTIONS: Required<SubscriptionOptions> = {
    includeQuantumState: true,
    includeEmotionalState: true,
    includeConsciousness: true,
    includeDimensions: true,
    updateInterval: 2000,
    mode: 'polling' as UpdateMode,
    retryAttempts: 5,
    retryDelay: 1000,
    heartbeatInterval: 30000,
    offlineQueueSize: 100,
    statePersistenceKey: 'realtime_state'
};

interface QueuedMessage {
    message: RealtimeMessage;
    timestamp: bigint;
    retries: number;
}

export class RealtimeService implements RealtimeConnection {
    private ws: WebSocket | null = null;
    private eventHandlers: Set<RealtimeEventHandler> = new Set();
    private _state: WebSocketState = {
        connected: false,
        error: null,
        reconnectAttempts: 0,
        lastUpdate: undefined,
        mode: 'polling'
    };
    private subscriptions: Map<string, Required<SubscriptionOptions>> = new Map();
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private messageQueue: QueuedMessage[] = [];
    private lastHeartbeat: bigint = BigInt(0);
    private _mode: UpdateMode = 'polling';
    private _options: Required<SubscriptionOptions>;

    constructor(
        private readonly endpoint: string,
        options?: Partial<SubscriptionOptions>
    ) {
        this._options = { ...DEFAULT_OPTIONS, ...options };
        this._mode = this._options.mode;
        this.loadPersistedState();
        this.startHeartbeat();
    }

    get state(): WebSocketState {
        return this._state;
    }

    get mode(): UpdateMode {
        return this._mode;
    }

    get options(): Required<SubscriptionOptions> {
        return this._options;
    }

    public async connect(): Promise<void> {
        if (this.ws?.readyState === WebSocket.OPEN) return;

        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.endpoint);

                this.ws.onopen = () => {
                    this.updateState({
                        connected: true,
                        error: null,
                        reconnectAttempts: 0,
                        lastUpdate: BigInt(Date.now())
                    });
                    
                    this.processOfflineQueue();
                    this.resubscribeAll();
                    
                    this.notifyHandlers({
                        type: UpdateType.CONNECTED,
                        anima_id: '',
                        message: 'Connected to realtime service',
                        timestamp: BigInt(Date.now())
                    });
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message: RealtimeMessage = JSON.parse(event.data);
                        this.handleMessage(message);
                        this.updateLastHeartbeat();
                    } catch (err) {
                        console.error('Failed to parse message:', err);
                    }
                };

                this.ws.onclose = () => {
                    this.handleDisconnect();
                };

                this.ws.onerror = (error) => {
                    const wsError: WebSocketError = {
                        code: 1006,
                        message: 'WebSocket error occurred',
                        details: { originalError: error }
                    };
                    this.updateState({ error: wsError });
                    reject(wsError);
                };
            } catch (err) {
                const error: WebSocketError = {
                    code: 1006,
                    message: 'Failed to establish connection',
                    details: { originalError: err }
                };
                this.updateState({ error });
                reject(error);
            }
        });
    }

    public disconnect(): void {
        this.stopHeartbeat();
        
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.updateState({
            connected: false,
            error: null,
            reconnectAttempts: 0,
            lastUpdate: undefined
        });
    }

    public async subscribe(animaId: string, options?: SubscriptionOptions): Promise<void> {
        const fullOptions = { ...DEFAULT_OPTIONS, ...options };
        this.subscriptions.set(animaId, fullOptions);

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            await this.connect();
        }

        const message: RealtimeMessage = {
            type: UpdateType.SUBSCRIBE,
            anima_id: animaId,
            message: 'Subscribing to updates',
            timestamp: BigInt(Date.now())
        };

        this.sendOrQueue(message);
    }

    public async unsubscribe(animaId: string): Promise<void> {
        this.subscriptions.delete(animaId);

        const message: RealtimeMessage = {
            type: UpdateType.UNSUBSCRIBE,
            anima_id: animaId,
            message: 'Unsubscribing from updates',
            timestamp: BigInt(Date.now())
        };

        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        }

        if (this.subscriptions.size === 0) {
            this.disconnect();
        }
    }

    public isConnected(): boolean {
        return this._state.connected && this.isHeartbeatActive();
    }

    public addEventListener(handler: RealtimeEventHandler): void {
        this.eventHandlers.add(handler);
    }

    public removeEventListener(handler: RealtimeEventHandler): void {
        this.eventHandlers.delete(handler);
    }

    private updateState(newState: Partial<WebSocketState>): void {
        this._state = { ...this._state, ...newState };
        this.persistState();
    }

    private notifyHandlers(message: RealtimeMessage): void {
        this.eventHandlers.forEach(handler => {
            try {
                handler(message);
            } catch (err) {
                console.error('Error in event handler:', err);
            }
        });
    }

    private handleMessage(message: RealtimeMessage): void {
        this.updateState({ lastUpdate: message.timestamp });
        
        if (message.type === UpdateType.ERROR && message.error) {
            this.updateState({ error: message.error });
        }
        
        this.notifyHandlers(message);
    }

    private handleDisconnect(): void {
        this.updateState({ connected: false });
        
        const message: RealtimeMessage = {
            type: UpdateType.DISCONNECTED,
            anima_id: '',
            message: 'Disconnected from realtime service',
            timestamp: BigInt(Date.now())
        };
        
        this.notifyHandlers(message);
        this.stopHeartbeat();

        if (this.subscriptions.size > 0 && 
            (this._state.reconnectAttempts || 0) < this._options.retryAttempts) {
            this.reconnectTimeout = setTimeout(() => {
                this.updateState({ 
                    reconnectAttempts: (this._state.reconnectAttempts || 0) + 1 
                });
                this.connect().catch(err => {
                    console.error('Reconnection attempt failed:', err);
                });
            }, this._options.retryDelay * Math.pow(2, this._state.reconnectAttempts || 0));
        }
    }

    private startHeartbeat(): void {
        this.stopHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
            this.checkHeartbeat();
        }, this._options.heartbeatInterval);
    }

    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    private sendHeartbeat(): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const heartbeat: RealtimeMessage = {
                type: UpdateType.HEARTBEAT,
                anima_id: '',
                timestamp: BigInt(Date.now())
            };
            this.ws.send(JSON.stringify(heartbeat));
        }
    }

    private updateLastHeartbeat(): void {
        this.lastHeartbeat = BigInt(Date.now());
    }

    private isHeartbeatActive(): boolean {
        const now = BigInt(Date.now());
        return (now - this.lastHeartbeat) < BigInt(this._options.heartbeatInterval * 2);
    }

    private checkHeartbeat(): void {
        if (!this.isHeartbeatActive() && this._state.connected) {
            console.warn('Heartbeat timeout, reconnecting...');
            this.handleDisconnect();
        }
    }

    private sendOrQueue(message: RealtimeMessage): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            this.queueMessage(message);
        }
    }

    private queueMessage(message: RealtimeMessage): void {
        if (this.messageQueue.length >= this._options.offlineQueueSize) {
            this.messageQueue.shift();
        }
        this.messageQueue.push({
            message,
            timestamp: BigInt(Date.now()),
            retries: 0
        });
    }

    private async processOfflineQueue(): Promise<void> {
        while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
            const queuedMessage = this.messageQueue[0];
            try {
                this.ws.send(JSON.stringify(queuedMessage.message));
                this.messageQueue.shift();
            } catch (err) {
                if (queuedMessage.retries < this._options.retryAttempts) {
                    queuedMessage.retries++;
                    await new Promise(resolve => setTimeout(resolve, this._options.retryDelay));
                } else {
                    this.messageQueue.shift();
                    console.error('Failed to send queued message:', err);
                }
            }
        }
    }

    private async resubscribeAll(): Promise<void> {
        for (const [animaId, options] of this.subscriptions.entries()) {
            try {
                const message: RealtimeMessage = {
                    type: UpdateType.SUBSCRIBE,
                    anima_id: animaId,
                    message: 'Resubscribing to updates',
                    timestamp: BigInt(Date.now())
                };
                this.ws?.send(JSON.stringify(message));
            } catch (err) {
                console.error(`Failed to resubscribe to ${animaId}:`, err);
            }
        }
    }

    private persistState(): void {
        try {
            const stateToSave = {
                subscriptions: Array.from(this.subscriptions.entries()),
                lastUpdate: this._state.lastUpdate?.toString(),
                mode: this._mode
            };
            localStorage.setItem(this._options.statePersistenceKey, JSON.stringify(stateToSave));
        } catch (err) {
            console.error('Failed to persist state:', err);
        }
    }

    private loadPersistedState(): void {
        try {
            const savedState = localStorage.getItem(this._options.statePersistenceKey);
            if (savedState) {
                const parsed = JSON.parse(savedState);
                this.subscriptions = new Map(parsed.subscriptions);
                this._state.lastUpdate = parsed.lastUpdate ? BigInt(parsed.lastUpdate) : undefined;
                this._mode = parsed.mode;
            }
        } catch (err) {
            console.error('Failed to load persisted state:', err);
        }
    }
}