import { Principal } from '@dfinity/principal';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { createActor } from '@/utils/createActor';
import type { _SERVICE as AnimaService } from '@/declarations/anima/anima.did';

export interface PaymentVerification {
  status: 'pending' | 'verified' | 'failed';
  blockHeight?: bigint;
  error?: string;
}

export class PaymentVerificationService {
  private static readonly VERIFICATION_ATTEMPTS = 10;
  private static readonly ATTEMPT_DELAY = 2000; // 2 seconds
  private static actor: any = null;

  private static async getActor(identity: Principal) {
    if (!this.actor) {
      this.actor = await createActor<AnimaService>('anima', identity);
    }
    return this.actor;
  }

  static async verifyPayment(
    from: Principal,
    to: string,
    amount: bigint,
    memo: bigint
  ): Promise<PaymentVerification> {
    let attempts = 0;
    const actor = await this.getActor(from);

    while (attempts < this.VERIFICATION_ATTEMPTS) {
      try {
        const result = await actor.verify_payment({
          from,
          to: AccountIdentifier.fromHex(to).toHex(),
          amount,
          memo
        });

        if ('ok' in result) {
          return {
            status: 'verified',
            blockHeight: result.ok
          };
        }

        if (result.err === 'PendingVerification') {
          await new Promise(resolve => setTimeout(resolve, this.ATTEMPT_DELAY));
          attempts++;
          continue;
        }

        return {
          status: 'failed',
          error: result.err
        };

      } catch (error) {
        console.error('Payment verification failed:', error);
        return {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown verification error'
        };
      }
    }

    return {
      status: 'failed',
      error: 'Verification timeout'
    };
  }

  static async waitForVerification(
    from: Principal,
    to: string,
    amount: bigint,
    memo: bigint,
    onUpdate?: (status: PaymentVerification) => void
  ): Promise<PaymentVerification> {
    let verification: PaymentVerification = { status: 'pending' };
    
    do {
      verification = await this.verifyPayment(from, to, amount, memo);
      onUpdate?.(verification);

      if (verification.status === 'pending') {
        await new Promise(resolve => setTimeout(resolve, this.ATTEMPT_DELAY));
      }
    } while (verification.status === 'pending');

    return verification;
  }
}