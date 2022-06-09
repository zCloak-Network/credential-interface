import { KeyringPair } from '@polkadot/keyring/types';
import { keyring } from '@polkadot/ui-keyring';

export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum';

keyring.loadAll({});
keyring.setSS58Format(38);

export function createAccount(
  mnemonic: string,
  meta?: Record<string, unknown>,
  pairType: KeypairType = 'sr25519'
): KeyringPair {
  return keyring.createFromUri(mnemonic, meta, pairType);
}
