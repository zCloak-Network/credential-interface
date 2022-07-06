import type { KeyringAddress, KeyringPairs$Json } from '@polkadot/ui-keyring/types';

import { EncryptedJson } from '@polkadot/util-crypto/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { Keyring } from './Keyring';
import { QueueCallbackInput } from './types';
import UnlockModal from './UnlockModal';

interface KeystoreState {
  keyring: Keyring;
  allAccounts: KeyringAddress[];
  addKeystore: (mnemonic: string, password: string) => Promise<KeyringPairs$Json>;
  restoreKeystore: (json: EncryptedJson, password: string) => void;
}

export const KeystoreContext = createContext<KeystoreState>({} as KeystoreState);

export type ACCOUNT_TYPE = 'attester' | 'claimer';

let queueCallback: (input: QueueCallbackInput) => void;

function unlock(publicKey: Uint8Array): Promise<void> {
  return new Promise((resolve, reject) => {
    queueCallback({
      publicKey,
      callback: (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    });
  });
}

const keyring = new Keyring(unlock);

const KeystoreProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [allAccounts, setAllAccounts] = useState<KeyringAddress[]>(keyring.getAccounts());
  const [queueUnlock, setQueueUnlock] = useState<QueueCallbackInput[]>([]);

  queueCallback = useCallback((input: QueueCallbackInput) => {
    setQueueUnlock((queue) => [...queue, input]);
  }, []);

  useEffect(() => {
    const subscription = keyring.accounts.subject.subscribe(() => {
      setAllAccounts(keyring.getAccounts());
    });

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, []);

  const addKeystore = useCallback(
    (mnemonic: string, password: string): Promise<KeyringPairs$Json> => {
      const result1 = keyring.addUri(mnemonic, password, {}, 'sr25519');
      const result2 = keyring.addUri(mnemonic, password, {}, 'ed25519');

      return keyring.backupAccounts([result1.pair.address, result2.pair.address], password);
    },
    []
  );

  const restoreKeystore = useCallback((json: EncryptedJson, password: string) => {
    keyring.restoreAccounts(json, password);
  }, []);

  return (
    <KeystoreContext.Provider
      value={{
        allAccounts,
        keyring,
        addKeystore,
        restoreKeystore
      }}
    >
      {children}
      {queueUnlock.length > 0 && (
        <UnlockModal
          onClose={() => {
            setQueueUnlock((queue) => queue.slice(1));
            queueUnlock[0].callback(new Error('User reject'));
          }}
          onUnlock={() => {
            setQueueUnlock((queue) => queue.slice(1));
            queueUnlock[0].callback(null);
          }}
          open
          publicKey={queueUnlock[0].publicKey}
        />
      )}
    </KeystoreContext.Provider>
  );
};

export function useKeystore() {
  const context = useContext(KeystoreContext);

  return context;
}

export default React.memo<typeof KeystoreProvider>(KeystoreProvider);
