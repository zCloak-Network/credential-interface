import { KeyringPair } from '@polkadot/keyring/types';
import { keyring } from '@polkadot/ui-keyring';

export function createAccount(mnemonic: string): KeyringPair {
  return keyring.createFromUri(mnemonic);
}
