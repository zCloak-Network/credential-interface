import { ApiPromise } from '@polkadot/api';
import { useContext } from 'react';

import { Attester } from '@zcloak/credential-core';

import { DidsContext } from './DidsProvider';

export function useAttester(): {
  attester: Attester;
  api: ApiPromise;
  isReady: boolean;
  account: string;
} {
  const { account, api, dids, isReady } = useContext(DidsContext);

  if (!(dids instanceof Attester)) {
    throw new Error('Please provide Attester did');
  }

  return {
    api,
    attester: dids,
    isReady,
    account
  };
}
