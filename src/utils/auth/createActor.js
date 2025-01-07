import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "@/declarations/anima";
import { canisterEnv } from "@/config/canisterEnv";
import { ActorError, logError } from "@/utils/errorReporting";
import { checkActorMethods } from "@/utils/actorVerification";

const VERIFICATION_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const verifyActor = async (actor, retry = 0) => {
  try {
    const methodCheck = checkActorMethods(actor);
    if (!methodCheck.valid) {
      throw new Error(`Missing required methods: ${methodCheck.missingMethods.join(', ')}`);
    }

    // Try a simple query to verify connectivity
    const verificationPromise = actor.icrc7_name();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Verification timed out')), VERIFICATION_TIMEOUT);
    });

    await Promise.race([verificationPromise, timeoutPromise]);
    return true;
  } catch (error) {
    if (retry < MAX_RETRIES) {
      await delay(1000 * (retry + 1));
      return verifyActor(actor, retry + 1);
    }
    throw error;
  }
};

const createAgent = async (identity, contextDetails) => {
  const agent = new HttpAgent({
    identity,
    host: canisterEnv.host,
    verifyQuerySignatures: canisterEnv.isLocal ? false : true,
    fetchOptions: {
      signal: AbortSignal.timeout(30000),
    }
  });

  if (canisterEnv.isLocal) {
    try {
      await agent.fetchRootKey();
    } catch (error) {
      throw new ActorError('Failed to fetch root key in local mode', {
        ...contextDetails,
        error: error.message
      });
    }
  }

  return agent;
};

export const createAnimaActor = async (identity) => {
  const contextDetails = {
    canisterId: canisterEnv.anima,
    host: canisterEnv.host,
    isLocal: canisterEnv.isLocal,
    hasIdentity: !!identity,
    timestamp: new Date().toISOString()
  };

  try {
    if (!identity) {
      throw new ActorError('No identity provided for actor creation', contextDetails);
    }

    if (!idlFactory) {
      throw new ActorError('Failed to load IDL factory', contextDetails);
    }

    if (!canisterEnv.anima) {
      throw new ActorError('Invalid canister ID', contextDetails);
    }

    const agent = await createAgent(identity, contextDetails);

    try {
      const actor = await Actor.createActor(idlFactory, {
        agent,
        canisterId: canisterEnv.anima
      });

      await verifyActor(actor);
      return actor;
    } catch (error) {
      throw new ActorError('Failed to create or verify actor', {
        ...contextDetails,
        verificationError: error.message
      });
    }
  } catch (error) {
    const enrichedError = new ActorError(
      `Actor creation failed: ${error.message}`,
      {
        ...contextDetails,
        originalError: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      }
    );
    logError(enrichedError);
    throw enrichedError;
  }
};