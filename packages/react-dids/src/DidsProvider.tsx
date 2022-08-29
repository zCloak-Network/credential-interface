import { Blockchain } from '@kiltprotocol/chain-helpers';
import { connect, Did, DidUri, init } from '@kiltprotocol/sdk-js';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import UnlockModal from '@credential/react-dids/UnlockModal';
import { useToggle } from '@credential/react-hooks';

import initManager, { didManager, loadAll } from './initManager';
import { DidsState } from './types';

export const DidsContext = createContext({} as DidsState);

let blockchain: Blockchain;

initManager();
loadAll();

init({
  address: endpoint.endpoint
});

let unlockPromiseResolve: () => void;
let unlockPromiseReject: (error: Error) => void;

const DidsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [unlockOpen, toggleUnlock] = useToggle();
  const [didUris, setDidUris] = useState<DidUri[]>([...didManager.didUris]);
  const didUri = useMemo(() => (didUris.length > 0 ? didUris[0] : null), [didUris]);

  const light = useMemo(() => (didUri ? Did.LightDidDetails.fromUri(didUri) : null), [didUri]);
  const [full, setFull] = useState<Did.FullDidDetails | null>(null);

  const fetchFullDid = useCallback(() => {
    if (light) {
      Did.FullDidDetails.fromChainInfo(
        Did.Utils.getKiltDidFromIdentifier(light.identifier, 'full')
      ).then(setFull);
    } else {
      setFull(null);
    }
  }, [light]);

  useEffect(() => {
    const didChange = () => setDidUris([...didManager.didUris]);

    didManager.on('add', didChange);
    didManager.on('remove', didChange);

    return () => {
      didManager.off('add', didChange);
      didManager.off('remove', didChange);
    };
  }, []);

  useEffect(() => {
    fetchFullDid();
  }, [fetchFullDid, light]);

  const logout = useCallback((didUriOrDetails: DidUri | Did.LightDidDetails) => {
    setIsLocked(true);

    didManager.removeDid(didUriOrDetails);
  }, []);

  const unlockDid = useCallback((didUriOrDetails: DidUri | Did.DidDetails, password: string) => {
    if (typeof didUriOrDetails === 'string') {
      didUriOrDetails = Did.LightDidDetails.fromUri(didUriOrDetails);
    }

    didManager.getPair(didUriOrDetails.authenticationKey.publicKey).unlock(password);
    didUriOrDetails.encryptionKey &&
      didManager.getPair(didUriOrDetails.encryptionKey.publicKey).unlock(password);

    setIsLocked(false);
  }, []);

  const unlock = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      unlockPromiseResolve = resolve;
      unlockPromiseReject = reject;
      toggleUnlock();
    });
  }, [toggleUnlock]);

  useEffect(() => {
    connect()
      .then((_blockchain) => {
        blockchain = _blockchain;

        return blockchain;
      })
      .then(() => {
        setIsReady(true);
      });
  }, [didUris]);

  const value: DidsState = useMemo(
    (): DidsState => ({
      isReady,
      blockchain,
      all: didUris,
      light,
      full,
      isLocked,
      fetchFullDid,
      logout,
      unlockDid,
      unlock
    }),
    [didUris, fetchFullDid, full, isLocked, isReady, light, logout, unlock, unlockDid]
  );

  return (
    <DidsContext.Provider value={value}>
      {children}
      {unlockOpen && (
        <UnlockModal
          did={didUri}
          onClose={() => {
            unlockPromiseReject(new Error('User reject'));
            toggleUnlock();
          }}
          onUnlock={() => {
            unlockPromiseResolve();
            toggleUnlock();
          }}
          open
          unlockDid={unlockDid}
        />
      )}
    </DidsContext.Provider>
  );
};

export default React.memo<typeof DidsProvider>(DidsProvider);
