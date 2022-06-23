import { ApiPromise } from '@polkadot/api';
import { useContext } from 'react';

import { Dids } from '@zcloak/credential-core';

import { DidsContext } from './DidsProvider';

export function useDids(): {
  dids: Dids;
  api: ApiPromise;
  isReady: boolean;
  account: string;
} {
  const { account, api, dids, isReady } = useContext(DidsContext);

  if (!(dids instanceof Dids)) {
    throw new Error('Please provide Claimer did');
  }

  return {
    api,
    dids,
    isReady,
    account
  };
}
