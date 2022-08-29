import type { Blockchain } from '@kiltprotocol/chain-helpers';
import type { Did, DidUri } from '@kiltprotocol/sdk-js';

export type DidRole = 'attester' | 'claimer';

export interface DidsState {
  isReady: boolean;
  blockchain: Blockchain;
  all: DidUri[];
  full: Did.FullDidDetails | null;
  light: Did.LightDidDetails | null;
  isLocked: boolean;
  fetchFullDid: () => void;
  logout: (didUriOrDetails: DidUri | Did.LightDidDetails) => void;
  unlock: () => Promise<void>;
  unlockDid: (didUriOrDetails: DidUri | Did.DidDetails, password: string) => void;
}
