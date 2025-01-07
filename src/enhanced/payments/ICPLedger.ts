import { Actor } from '@dfinity/agent';
import { AccountIdentifier } from '@dfinity/nns';
import { LedgerCanister } from '@dfinity/ledger-icp';

export class ICPLedgerService {
  private ledger: LedgerCanister;

  constructor(ledger: LedgerCanister) {
    this.ledger = ledger;
  }

  async transfer(to: AccountIdentifier, amount: bigint) {
    try {
      const result = await this.ledger.transfer({
        memo: BigInt(0),
        amount: { e8s: amount },
        to,
        fee: { e8s: BigInt(10000) },
        fromSubaccount: [],
        created_at_time: []
      });

      return result;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw new Error('ICP transfer failed');
    }
  }

  async getBalance(accountId: AccountIdentifier): Promise<bigint> {
    try {
      const balance = await this.ledger.accountBalance({
        accountIdentifier: accountId
      });
      return balance.e8s;
    } catch (error) {
      console.error('Balance check failed:', error);
      throw new Error('Failed to get ICP balance');
    }
  }
}