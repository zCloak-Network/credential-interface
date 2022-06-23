import type { ApiPromise } from '@polkadot/api';
import type { Dids } from '@zcloak/credential-core';

export interface DidsState {
  didIsReady: boolean;
  isReady: boolean;
  account: string;
  api: ApiPromise;
  dids: Dids;
}
