type LogLevel = 'info' | 'warn' | 'error';

interface AIEvent {
  timestamp: number;
  type: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class AIEventBus {
  private static instance: AIEventBus;
  private events: AIEvent[] = [];
  private maxEvents: number = 1000;
  private subscribers: Set<(event: AIEvent) => void> = new Set();

  private constructor() {}

  static getInstance(): AIEventBus {
    if (!AIEventBus.instance) {
      AIEventBus.instance = new AIEventBus();
    }
    return AIEventBus.instance;
  }

  subscribe(callback: (event: AIEvent) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private emit(event: AIEvent) {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    this.subscribers.forEach(callback => callback(event));
  }

  log(message: string, data?: any) {
    this.emit({
      timestamp: Date.now(),
      type: 'ai_operation',
      level: 'info',
      message,
      data
    });
  }

  warn(message: string, data?: any) {
    this.emit({
      timestamp: Date.now(),
      type: 'ai_warning',
      level: 'warn',
      message,
      data
    });
  }

  error(message: string, error?: Error) {
    this.emit({
      timestamp: Date.now(),
      type: 'ai_error',
      level: 'error',
      message,
      data: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }

  getEvents(): AIEvent[] {
    return [...this.events];
  }

  clear() {
    this.events = [];
  }

  getLatestEvents(count: number = 10): AIEvent[] {
    return this.events.slice(-count);
  }

  getEventsByType(type: string): AIEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsByLevel(level: LogLevel): AIEvent[] {
    return this.events.filter(event => event.level === level);
  }
}

export const aiEventBus = AIEventBus.getInstance();