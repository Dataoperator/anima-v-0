import logger from './logging';

export const REQUIRED_METHODS = [
  'get_user_state',
  'initiate_payment',
  'complete_payment',
  'mint_anima',
  'get_anima',
  'interact',
  'icrc7_name'
];

const HEALTH_CHECKS = {
  IDENTITY: 'identity',
  METHODS: 'methods',
  CONNECTIVITY: 'connectivity',
  STATE: 'state'
};

export const checkActorMethods = (actor) => {
  const startTime = performance.now();
  const missingMethods = REQUIRED_METHODS.filter(method => !(method in actor));
  const result = {
    valid: missingMethods.length === 0,
    missingMethods
  };

  logger.info('actorVerification', 'Method check completed', {
    duration: performance.now() - startTime,
    result
  });

  return result;
};

export const verifyActorHealth = async (actor, identity) => {
  const healthStatus = {
    [HEALTH_CHECKS.IDENTITY]: false,
    [HEALTH_CHECKS.METHODS]: false,
    [HEALTH_CHECKS.CONNECTIVITY]: false,
    [HEALTH_CHECKS.STATE]: false,
    details: {},
    timestamp: new Date().toISOString()
  };

  try {
    // Identity Check
    if (identity && identity.getPrincipal()) {
      healthStatus[HEALTH_CHECKS.IDENTITY] = true;
      healthStatus.details.principal = identity.getPrincipal().toString();
    }

    // Methods Check
    const methodCheck = checkActorMethods(actor);
    healthStatus[HEALTH_CHECKS.METHODS] = methodCheck.valid;
    healthStatus.details.methods = methodCheck;

    // Connectivity Check
    try {
      const startTime = performance.now();
      const name = await actor.icrc7_name();
      const duration = performance.now() - startTime;
      
      healthStatus[HEALTH_CHECKS.CONNECTIVITY] = true;
      healthStatus.details.connectivity = {
        responseTime: duration,
        canisterName: name
      };
    } catch (error) {
      logger.error('actorVerification', 'Connectivity check failed', { error });
      healthStatus.details.connectivity = {
        error: error.message
      };
    }

    // State Check
    try {
      const startTime = performance.now();
      const state = await actor.get_user_state([]);
      const duration = performance.now() - startTime;

      healthStatus[HEALTH_CHECKS.STATE] = true;
      healthStatus.details.state = {
        responseTime: duration,
        isInitialized: 'Initialized' in state
      };
    } catch (error) {
      logger.error('actorVerification', 'State check failed', { error });
      healthStatus.details.state = {
        error: error.message
      };
    }

    logger.info('actorVerification', 'Health check completed', { healthStatus });
  } catch (error) {
    logger.error('actorVerification', 'Health check failed', { error });
  }

  return healthStatus;
};

export const getActorMethodStatus = async (actor) => {
  if (!actor) {
    logger.error('actorVerification', 'No actor provided');
    return {
      success: false,
      error: 'No actor provided'
    };
  }

  const startTime = performance.now();
  
  try {
    // Method check
    const methodCheck = checkActorMethods(actor);
    if (!methodCheck.valid) {
      throw new Error(`Missing required methods: ${methodCheck.missingMethods.join(', ')}`);
    }

    // Verify connectivity
    const name = await actor.icrc7_name();
    
    const duration = performance.now() - startTime;
    logger.info('actorVerification', 'Actor verification successful', {
      duration,
      canisterName: name
    });

    return {
      success: true,
      details: {
        duration,
        canisterName: name
      }
    };
  } catch (error) {
    logger.error('actorVerification', 'Actor verification failed', { error });
    return {
      success: false,
      error: error.message,
      details: {
        duration: performance.now() - startTime
      }
    };
  }
};