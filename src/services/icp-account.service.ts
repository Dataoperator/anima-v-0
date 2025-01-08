import { Principal } from '@dfinity/principal';
import { AccountIdentifier, SubAccount } from '@dfinity/ledger-icp';
import { sha224 } from '@dfinity/principal/lib/cjs/utils/sha224';
import { ErrorTracker } from './error-tracker';

export class AccountService {
  private static instance: AccountService;
  private errorTracker: ErrorTracker;

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
  }

  static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }
    return AccountService.instance;
  }

  createAccountIdentifier(principal: Principal, subaccount?: number[]): Uint8Array {
    // Create proper subaccount if provided
    const subAccount = subaccount ? SubAccount.fromBytes(new Uint8Array(subaccount)) : undefined;
    
    // Generate account identifier
    const accountIdentifier = AccountIdentifier.fromPrincipal({
      principal,
      subAccount
    });

    return accountIdentifier.toUint8Array();
  }

  accountToHex(accountId: Uint8Array): string {
    return Buffer.from(accountId).toString('hex');
  }

  accountFromHex(hex: string): Uint8Array {
    return new Uint8Array(Buffer.from(hex, 'hex'));
  }

  generateSubaccount(input: string): number[] {
    const hash = sha224(Buffer.from(input));
    return Array.from(hash);
  }

  validateAccountId(accountId: Uint8Array): boolean {
    try {
      // Verify length
      if (accountId.length !== 32) {
        return false;
      }

      // Verify checksum (last 4 bytes)
      const hash = sha224(accountId.slice(0, 28));
      const checksum = hash.slice(0, 4);
      
      return accountId.slice(28).every((byte, i) => byte === checksum[i]);
    } catch (error) {
      return false;
    }
  }
}

export const accountService = AccountService.getInstance();