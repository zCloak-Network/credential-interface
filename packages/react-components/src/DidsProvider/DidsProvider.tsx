import { connect } from '@kiltprotocol/sdk-js';
import { ApiPromise } from '@polkadot/api';
import React, { createContext, useEffect, useMemo, useState } from 'react';

import { Attester, Claimer, Dids } from '@zcloak/credential-core';

import { KILT_PEREGRINE_ENDPOINT } from '@credential/app-config/constants';
import { useKeystore } from '@credential/react-keystore';

import { DidsState } from './types';
import { createDidsFactory } from './utils';

let dids: Dids;
let api: ApiPromise;
let account: string;

export const DidsContext = createContext({} as DidsState);

const DidsProvider: React.FC<
  React.PropsWithChildren<{
    DidsConstructor: typeof Claimer | typeof Attester;
  }>
> = ({ DidsConstructor, children }) => {
  const [didIsReady, setDidIsReady] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { keystore } = useKeystore();

  useEffect(() => {
    if (keystore) {
      account = keystore.siningPair.address;

      if (DidsConstructor === Claimer) {
        dids = createDidsFactory(DidsConstructor)(keystore, KILT_PEREGRINE_ENDPOINT);
      } else if (DidsConstructor === Attester) {
        dids = createDidsFactory(DidsConstructor)(keystore, KILT_PEREGRINE_ENDPOINT);
      }
    }

    if (dids) {
      setDidIsReady(true);

      dids.isReady
        .then(() => connect())
        .then(({ api: _api }) => {
          api = _api;
          setIsReady(true);
        });
    }
  }, [DidsConstructor, keystore]);

  const value = useMemo(
    () => ({
      api,
      dids,
      account,
      isReady,
      didIsReady
    }),
    [didIsReady, isReady]
  );

  return <DidsContext.Provider value={value}>{didIsReady ? children : null}</DidsContext.Provider>;
};

export default React.memo<typeof DidsProvider>(DidsProvider);
