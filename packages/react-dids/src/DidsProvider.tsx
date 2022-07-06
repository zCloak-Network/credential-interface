import { Blockchain } from '@kiltprotocol/chain-helpers';
import { connect, Did, DidUri, init } from '@kiltprotocol/sdk-js';
import { EncryptionKeyType, VerificationKeyType } from '@kiltprotocol/types';
import { assert } from '@polkadot/util';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { KILT_PEREGRINE_ENDPOINT } from '@credential/app-config/constants';
import UnlockModal from '@credential/react-dids/UnlockModal';
import { useLocalStorage } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

import { DidKeys$Json, DidRole, DidsState } from './types';

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

  const generateDid = useCallback(
    async (mnemonic: string, password: string, didRole: DidRole): Promise<DidKeys$Json> => {
      const json = await addKeystore(mnemonic, password);
      const authenticationAccount = json.accounts[0];
      const encryptionAccount = json.accounts[1];

      if (didRole === 'claimer') {
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
      } else {
        const uri = Did.Utils.getKiltDidFromIdentifier(authenticationAccount.address, 'full');

        setDidUri(uri);

        return {
          didUri: uri,
          ...json
        };
      }
    },
    [addKeystore, keyring, setDidUri]
  );

  const restoreDid = useCallback(
    (text: string, password: string, didRole: DidRole): void => {
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

      const { type } = Did.Utils.parseDidUri(json.didUri);

      assert(didRole === 'attester' ? type === 'full' : type === 'light', 'did uri type error');

      restoreKeystore(json, password);
      setDidUri(json.didUri);
    },
    [restoreKeystore, setDidUri]
  );

  useEffect(() => {
    connect().then((_blockchain) => {
      blockchain = _blockchain;
      setIsReady(true);
    });
  }, []);

  const value = useMemo(
    () => ({
      isReady,
      blockchain,
      didUri,
      generateDid,
      restoreDid
    }),
    [didUri, generateDid, isReady, restoreDid]
  );

  return (
    <DidsContext.Provider value={value}>
      {children}
      {queueUnlock.length > 0 && (
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
        />
      )}
    </DidsContext.Provider>
  );
};

export default React.memo<typeof DidsProvider>(DidsProvider);
