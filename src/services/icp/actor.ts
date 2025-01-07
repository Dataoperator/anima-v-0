import { Actor, HttpAgent, Identity, ActorSubclass } from '@dfinity/agent';
import { idlFactory } from '../../declarations/ledger.did';
import { Principal } from '@dfinity/principal';
import { ErrorTracker, ErrorCategory, ErrorSeverity } from '@/services/error-tracker';
import { hash } from '@dfinity/principal/lib/cjs/utils/sha224';

const IC_HOST = "https://icp0.io";
const LOCAL_HOST = "http://localhost:4943";
const LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai';

const HOSTS = [
  "https://icp0.io",
  "https://ic0.app",
  "https://icp-api.io"
];

const isLocal = process.env.DFX_NETWORK !== "ic";

export interface LedgerService {
  account_balance: (args: { account: Array<number> }) => Promise<{ e8s: bigint }>;
  transfer: (args: {
    to: Array<number>;
    fee: { e8s: bigint };
    memo: bigint;
    from_subaccount?: [] | [Array<number>];
    created_at_time?: [] | [{ timestamp_nanos: bigint }];
    amount: { e8s: bigint };
  }) => Promise<{
    Ok?: bigint;
    Err?: {
      InsufficientFunds: { balance: { e8s: bigint } };
      TxDuplicate: { duplicate_of: bigint };
      TxCreatedInFuture: null;
      BadFee: { expected_fee: { e8s: bigint } };
    };
  }>;
}

class ActorCreationError extends Error {
  constructor(message: string, public readonly details?: any) {
    super(message);
    this.name = 'ActorCreationError';
  }
}

async function createAgentWithRetry(
  identity: Identity,
  host: string,
  retryCount = 0
): Promise<HttpAgent> {
  const maxRetries = 3;
  const errorTracker = ErrorTracker.getInstance();

  try {
    const agent = new HttpAgent({ host, identity });

    if (isLocal) {
      await agent.fetchRootKey().catch(error => {
        console.warn('Unable to fetch root key:', error);
        throw error;
      });
    }

    return agent;
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`Retrying agent creation in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return createAgentWithRetry(identity, host, retryCount + 1);
    }

    errorTracker.trackError(
      ErrorCategory.NETWORK,
      error instanceof Error ? error : new Error('Agent creation failed'),
      ErrorSeverity.HIGH,
      { host, retryCount }
    );
    throw new ActorCreationError('Failed to create agent', { host, error });
  }
}

function principalToAccountIdentifier(principal: Principal, subAccount?: Uint8Array): Uint8Array {
  const sha224 = hash();
  sha224.update(Buffer.from('\x0Aaccount-id'));
  sha224.update(principal.toUint8Array());
  sha224.update(subAccount || new Uint8Array(32));
  return new Uint8Array(sha224.digest());
}

async function verifyActor(
  actor: ActorSubclass<LedgerService>,
  identity: Identity
): Promise<void> {
  try {
    const principal = identity.getPrincipal();
    const accountIdBytes = principalToAccountIdentifier(principal);
    await actor.account_balance({ account: Array.from(accountIdBytes) });
    console.log('✅ Ledger actor verified successfully');
  } catch (error) {
    console.error('❌ Failed to verify ledger actor:', error);
    throw new ActorCreationError('Actor verification failed', { error });
  }
}

export const createLedgerActor = async (
  identity: Identity
): Promise<ActorSubclass<LedgerService>> => {
  if (!identity) {
    throw new ActorCreationError('Identity is required to create ledger actor');
  }

  const errorTracker = ErrorTracker.getInstance();
  const errors: Error[] = [];
  
  const hostsToTry = isLocal ? [LOCAL_HOST] : HOSTS;

  for (const host of hostsToTry) {
    try {
      console.log('🔄 Attempting to create ledger actor with host:', host);
      
      const agent = await createAgentWithRetry(identity, host);
      
      console.log('🔍 Creating actor with:', {
        canisterId: LEDGER_CANISTER_ID,
        host,
        identityPrincipal: identity.getPrincipal().toString()
      });

      const actor = Actor.createActor<LedgerService>(idlFactory, {
        agent,
        canisterId: LEDGER_CANISTER_ID
      });

      await verifyActor(actor, identity);

      return actor;
    } catch (error) {
      console.error(`❌ Failed with host ${host}:`, error);
      errors.push(error instanceof Error ? error : new Error('Unknown error'));
      
      if (host === hostsToTry[hostsToTry.length - 1]) {
        errorTracker.trackError(
          ErrorCategory.LEDGER,
          new ActorCreationError('All ledger actor creation attempts failed', { errors }),
          ErrorSeverity.CRITICAL,
          { 
            hosts: hostsToTry,
            identity: identity.getPrincipal().toString() 
          }
        );
      }
    }
  }

  throw new ActorCreationError('Failed to create ledger actor with all available hosts', {
    attempts: errors
  });
};