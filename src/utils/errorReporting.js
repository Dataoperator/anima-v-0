export class AuthenticationError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'AuthenticationError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export class ActorError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = 'ActorError';
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

export function logError(error, additionalContext = {}) {
  const errorDetails = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    context: error.context || {},
    timestamp: error.timestamp || new Date().toISOString(),
    ...additionalContext
  };

  console.error('Detailed Error:', {
    ...errorDetails,
    environment: {
      network: process.env.DFX_NETWORK || 'ic',
      buildVersion: process.env.BUILD_VERSION,
      isProduction: process.env.NODE_ENV === 'production'
    }
  });

  return errorDetails;
}