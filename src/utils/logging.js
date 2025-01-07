import { Principal } from '@dfinity/principal';

const MAX_LOG_SIZE = 100;
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor() {
    this.logs = [];
    this.diagnostics = {};
  }

  addLog(level, category, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data: this.sanitizeData(data)
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > MAX_LOG_SIZE) {
      this.logs.pop();
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console[level.toLowerCase()](`[${category}] ${message}`, data);
    }

    return logEntry;
  }

  sanitizeData(data) {
    return Object.entries(data).reduce((acc, [key, value]) => {
      // Handle Principal objects
      if (value instanceof Principal) {
        acc[key] = value.toString();
        return acc;
      }

      // Handle Error objects
      if (value instanceof Error) {
        acc[key] = {
          name: value.name,
          message: value.message,
          stack: value.stack
        };
        return acc;
      }

      // Handle objects recursively
      if (typeof value === 'object' && value !== null) {
        acc[key] = this.sanitizeData(value);
        return acc;
      }

      acc[key] = value;
      return acc;
    }, {});
  }

  updateDiagnostics(category, data) {
    this.diagnostics[category] = {
      ...this.diagnostics[category],
      ...data,
      lastUpdated: new Date().toISOString()
    };
  }

  debug(category, message, data = {}) {
    return this.addLog('DEBUG', category, message, data);
  }

  info(category, message, data = {}) {
    return this.addLog('INFO', category, message, data);
  }

  warn(category, message, data = {}) {
    return this.addLog('WARN', category, message, data);
  }

  error(category, message, data = {}) {
    const logEntry = this.addLog('ERROR', category, message, data);
    this.updateDiagnostics('errors', {
      lastError: {
        ...logEntry,
        data
      }
    });
    return logEntry;
  }

  getLogsByCategory(category) {
    return this.logs.filter(log => log.category === category);
  }

  getLogsByLevel(level) {
    return this.logs.filter(log => log.level === level);
  }

  getDiagnostics() {
    return {
      ...this.diagnostics,
      logStats: {
        total: this.logs.length,
        byLevel: Object.fromEntries(
          Object.keys(LOG_LEVELS).map(level => [
            level,
            this.logs.filter(log => log.level === level).length
          ])
        ),
        byCategory: this.logs.reduce((acc, log) => {
          acc[log.category] = (acc[log.category] || 0) + 1;
          return acc;
        }, {})
      }
    };
  }

  clear() {
    this.logs = [];
    this.diagnostics = {};
  }
}

// Create singleton instance
const logger = new Logger();
export default logger;