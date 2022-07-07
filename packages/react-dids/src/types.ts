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
  generateDid: (mnemonic: string, password: string, didRole: DidRole) => Promise<DidKeys$Json>;
  restoreDid: (text: string, password: string, didRole: DidRole) => void;
}
