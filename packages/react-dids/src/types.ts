import type { Blockchain } from '@kiltprotocol/chain-helpers';
import type { DidUri } from '@kiltprotocol/sdk-js';
import type { KeyringPairs$Json } from '@polkadot/ui-keyring/types';

export type DidRole = 'attester' | 'claimer';

export interface DidKeys$Json extends KeyringPairs$Json {
  didUri: DidUri;
}

export interface DidsState {
  isReady: boolean;
  blockchain: Blockchain;
  didUri?: DidUri;
  isLocked: boolean;
  isFullDid: boolean;
  needUpgrade: boolean; // if the did is full did, should it to upgrade
  generateDid: (mnemonic: string, password: string) => Promise<DidKeys$Json>;
  restoreDid: (text: string, password: string) => void;
  unlockDid: (didUri: DidUri, password: string) => Promise<void>;
}
