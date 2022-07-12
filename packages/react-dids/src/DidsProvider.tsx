import { Blockchain } from '@kiltprotocol/chain-helpers';
import { connect, Did, DidUri, init } from '@kiltprotocol/sdk-js';
import { EncryptionKeyType, VerificationKeyType } from '@kiltprotocol/types';
import { assert } from '@polkadot/util';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { KILT_PEREGRINE_ENDPOINT } from '@credential/app-config/constants';
import UnlockModal from '@credential/react-dids/UnlockModal';
import { useLocalStorage } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

import { DidKeys$Json, DidsState } from './types';
import { getDidDetails } from './useDidDetails';

export const DidsContext = createContext({} as DidsState);

let blockchain: Blockchain;

const storageKey = 'credential:didUri';

init({
  address: KILT_PEREGRINE_ENDPOINT
});

const DidsProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const { addKeystore, keyring, queueUnlock, restoreKeystore, setQueueUnlock } = useKeystore();
  const [didUri, setDidUri] = useLocalStorage<DidUri>(storageKey);
  const [isLocked, setIsLocked] = useState(true);
  const [needUpgrade, setNeedUpgrade] = useState(false);

  useEffect(() => {
    try {
      if (didUri) {
        const { identifier, type } = Did.Utils.parseDidUri(didUri);

        Did.FullDidDetails.fromChainInfo(
          type === 'light'
            ? Did.Utils.getKiltDidFromIdentifier(identifier.slice(2), 'full')
            : didUri
        ).then((data) => {
          if (data !== null) {
            setDidUri(data.uri);
            setNeedUpgrade(
              !(
                keyring.getPair(data.authenticationKey.publicKey) &&
                data.encryptionKey &&
                keyring.getPair(data.encryptionKey.publicKey) &&
                data.attestationKey &&
                keyring.getPair(data.attestationKey.publicKey) &&
                data.delegationKey &&
                keyring.getPair(data.delegationKey.publicKey)
              )
            );
          }
        });
      }
    } catch {}
  }, [didUri, keyring, setDidUri]);

  const isFullDid = useMemo(() => {
    try {
      if (didUri) {
        const { type } = Did.Utils.parseDidUri(didUri);

        if (type === 'full') {
          return true;
        }
      }
    } catch {}

    return false;
  }, [didUri]);

  const generateDid = useCallback(
    async (mnemonic: string, password: string): Promise<DidKeys$Json> => {
      const json = await addKeystore(mnemonic, password);
      const authenticationAccount = json.accounts[0];
      const encryptionAccount = json.accounts[1];

      const uri = Did.LightDidDetails.fromDetails({
        authenticationKey: {
          publicKey: keyring.getPair(authenticationAccount.address).publicKey,
          type:
            keyring.getPair(authenticationAccount.address).type === 'sr25519'
              ? VerificationKeyType.Sr25519
              : VerificationKeyType.Ed25519
        },
        encryptionKey: {
          publicKey: keyring.getPair(encryptionAccount.address).publicKey,
          type: EncryptionKeyType.X25519
        }
      }).uri;

      setDidUri(uri);

      return {
        didUri: uri,
        ...json
      };
    },
    [addKeystore, keyring, setDidUri]
  );

  const restoreDid = useCallback(
    (text: string, password: string): void => {
      const json = JSON.parse(text) as DidKeys$Json;

      assert(
        json.didUri &&
          json.accounts &&
          typeof json.accounts === 'object' &&
          json.accounts.length > 0 &&
          json.encoded &&
          json.encoding,
        'did file format error'
      );

      restoreKeystore(json, password);
      setDidUri(json.didUri);
    },
    [restoreKeystore, setDidUri]
  );

  const unlockDid = useCallback(
    async (didUri: DidUri, password: string) => {
      const didDetails = await getDidDetails(didUri);

      if (!didDetails) throw new Error("Can't find did details");

      keyring.getPair(didDetails.authenticationKey.publicKey).unlock(password);
      didDetails.encryptionKey &&
        keyring.getPair(didDetails.encryptionKey.publicKey).unlock(password);

      setIsLocked(false);
    },
    [keyring]
  );

  useEffect(() => {
    connect().then((_blockchain) => {
      blockchain = _blockchain;
      setIsReady(true);
    });
  }, []);

  const value: DidsState = useMemo(
    (): DidsState => ({
      isReady,
      blockchain,
      didUri,
      isLocked,
      isFullDid,
      needUpgrade,
      generateDid,
      restoreDid,
      unlockDid
    }),
    [didUri, generateDid, isFullDid, isLocked, isReady, needUpgrade, restoreDid, unlockDid]
  );

  useEffect(() => {
    if (!isLocked && queueUnlock.length > 0) {
      queueUnlock.forEach((queue) => queue.callback(null));
      setQueueUnlock([]);
    }
  }, [isLocked, queueUnlock, setQueueUnlock]);

  return (
    <DidsContext.Provider value={value}>
      {children}
      {isLocked && queueUnlock.length > 0 && (
        <UnlockModal
          did={didUri}
          onClose={() => {
            setQueueUnlock(queueUnlock.slice(1));
            queueUnlock[0].callback(new Error('User reject'));
          }}
          onUnlock={() => {
            setQueueUnlock(queueUnlock.slice(1));
            queueUnlock[0].callback(null);
          }}
          open
          unlockDid={unlockDid}
        />
      )}
    </DidsContext.Provider>
  );
};

export default React.memo<typeof DidsProvider>(DidsProvider);
