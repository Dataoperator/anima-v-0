import { Principal } from '@dfinity/principal';
import { getCrc32 } from '@/utils/hash';
import crc32 from 'buffer-crc32';
import { sha256 } from '@/utils/hash';

export const SUB_ACCOUNT_ZERO = Buffer.alloc(32);
const ACCOUNT_DOMAIN_SEPERATOR = '\x0Aaccount-id';

export function principalToAccountIdentifier(principal: Principal, subAccount: Buffer = SUB_ACCOUNT_ZERO): Uint8Array {
  const bufferToHash = Buffer.concat([
    Buffer.from(ACCOUNT_DOMAIN_SEPERATOR),
    Buffer.from(principal.toUint8Array()),
    subAccount,
  ]);
  
  const hash = sha256(bufferToHash);
  const checksum = crc32(hash);

  return Buffer.concat([checksum, hash]);
}

export function getAccountIdentifier(principal: Principal, subAccount: Buffer = SUB_ACCOUNT_ZERO): string {
  return Buffer.from(principalToAccountIdentifier(principal, subAccount)).toString('hex');
}

export function validateAccountIdentifier(accountIdentifier: string): boolean {
  if (accountIdentifier.length !== 64) {
    return false;
  }
  
  const pattern = /^[0-9a-f]+$/i;
  if (!pattern.test(accountIdentifier)) {
    return false;
  }

  const bytes = Buffer.from(accountIdentifier, 'hex');
  const checksum = bytes.slice(0, 4);
  const hash = bytes.slice(4);
  const newChecksum = crc32(hash);
  
  return Buffer.compare(checksum, newChecksum) === 0;
}

export function accountIdentifierToBytes(accountIdentifier: string): Uint8Array {
  return Buffer.from(accountIdentifier, 'hex');
}

export function accountIdentifierToHex(accountIdentifier: Uint8Array): string {
  return Buffer.from(accountIdentifier).toString('hex');
}