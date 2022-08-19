import type { Blockchain } from '@kiltprotocol/chain-helpers';
import type { Did, DidUri } from '@kiltprotocol/sdk-js';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { KeyringPairs$Json } from '@polkadot/ui-keyring/types';

export type DidRole = 'attester' | 'claimer';

export type DidKeys$Json = {
  didUri: DidUri;
  keys?: KeyringPair$Json[];
} & Partial<KeyringPairs$Json>;

export interface DidsState {
  isReady: boolean;
  blockchain: Blockchain;
  didUri?: DidUri;
  didDetails: Did.DidDetails | null;
  isLocked: boolean;
  isFullDid: boolean;
  needUpgrade: boolean; // if the did is full did, should it to upgrade
  generateDid: (mnemonic: string, password: string) => DidKeys$Json;
  restoreDid: (text: string, password: string) => void;
  backupDid: (password: string) => DidKeys$Json | null;
  logout: () => void;
  unlock: () => Promise<void>;
  unlockDid: (password: string) => void;
  tryFetchFullDid: () => Promise<void>;
}
