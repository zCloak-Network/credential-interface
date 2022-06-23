import { ApiPromise } from '@polkadot/api';
import { useContext } from 'react';

import { Claimer } from '@zcloak/credential-core';

import { DidsContext } from './DidsProvider';

export function useClaimer(): {
  claimer: Claimer;
  api: ApiPromise;
  isReady: boolean;
  account: string;
} {
  const { account, api, dids, isReady } = useContext(DidsContext);

  if (!(dids instanceof Claimer)) {
    throw new Error('Please provide Claimer did');
  }

  return {
    api,
    claimer: dids,
    isReady,
    account
  };
}
