import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';

import { EncryptedJson } from '@polkadot/util-crypto/types';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { Keyring } from './Keyring';

interface KeystoreState {
  keyring: Keyring;
  allAccounts: KeyringAddress[];
  addKeystore: (mnemonic: string, password: string) => [KeyringPair$Json, KeyringPair$Json];
  restoreKeystore: (json: EncryptedJson | KeyringPair$Json[], password: string) => void;
}

export const KeystoreContext = createContext<KeystoreState>({} as KeystoreState);

export type ACCOUNT_TYPE = 'attester' | 'claimer';

const keyring = new Keyring();

const KeystoreProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [allAccounts, setAllAccounts] = useState<KeyringAddress[]>(keyring.getAccounts());

  useEffect(() => {
    const subscription = keyring.accounts.subject.subscribe(() => {
      setAllAccounts(keyring.getAccounts());
    });

    return (): void => {
      setTimeout(() => subscription.unsubscribe(), 0);
    };
  }, []);

  const addKeystore = useCallback(
    (mnemonic: string, password: string): [KeyringPair$Json, KeyringPair$Json] => {
      const result1 = keyring.addUri(mnemonic, password, {}, 'sr25519');
      const result2 = keyring.addUri(mnemonic, password, {}, 'ed25519');

      return [result1.json, result2.json];
    },
    []
  );

  const restoreKeystore = useCallback(
    (json: EncryptedJson | KeyringPair$Json[], password: string) => {
      if (Array.isArray(json)) {
        json.forEach((j) => {
          const pair = keyring.createFromJson(j);

          keyring.addPair(pair, password);
        });
      } else {
        keyring.restoreAccounts(json, password);
      }
    },
    []
  );

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
    </KeystoreContext.Provider>
  );
};

export function useKeystore() {
  const context = useContext(KeystoreContext);

  return context;
}

export default React.memo<typeof KeystoreProvider>(KeystoreProvider);
