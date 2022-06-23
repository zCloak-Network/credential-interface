import type { DidKeystore, KeyringPair$JsonExtra } from '@zcloak/credential-core/types';

import React, { createContext, useCallback, useContext, useState } from 'react';

import { JsonKeystore } from '@zcloak/credential-core';

import { createAccount } from './createKeyring';

interface KeystoreState {
  keystore: DidKeystore | null;
  type: ACCOUNT_TYPE;
  addKeystore: (mnemonic: string, passphrase?: string) => KeyringPair$JsonExtra;
  restoreKeystore: (text: string, passphrase?: string) => void;
}

export const KeystoreContext = createContext<KeystoreState>({} as KeystoreState);

export type ACCOUNT_TYPE = 'attester' | 'claimer';

const PREFIX = 'credential:account';

const ATTESTER: ACCOUNT_TYPE = 'attester';

const CLAIMER: ACCOUNT_TYPE = 'claimer';

function getAccountKeys(): string[] {
  const keys: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key?.startsWith(PREFIX)) {
      keys.push(key);
    }
  }

  return keys;
}

function filterKeys(keys: string[]): { claimerKeys: string[]; attesterKeys: string[] } {
  const claimerKeys: string[] = [];
  const attesterKeys: string[] = [];

  keys.forEach((key) => {
    if (key.startsWith(`${PREFIX}:${CLAIMER}`)) {
      claimerKeys.push(key);
    }

    if (key.startsWith(`${PREFIX}:${ATTESTER}`)) {
      attesterKeys.push(key);
    }
  });

  return { claimerKeys, attesterKeys };
}

const { attesterKeys, claimerKeys } = filterKeys(getAccountKeys());

let initClaimerKeystore: JsonKeystore | null = null;
let initAttesterKeystore: JsonKeystore | null = null;

if (claimerKeys.length > 0) {
  const data = localStorage.getItem(claimerKeys[0]);

  if (data) {
    const json = JSON.parse(data) as KeyringPair$JsonExtra;

    initClaimerKeystore = new JsonKeystore(json);
  }
}

if (attesterKeys.length > 0) {
  const data = localStorage.getItem(attesterKeys[0]);

  if (data) {
    const json = JSON.parse(data) as KeyringPair$JsonExtra;

    initAttesterKeystore = new JsonKeystore(json);
  }
}

const KeystoreProvider: React.FC<React.PropsWithChildren<{ type: ACCOUNT_TYPE }>> = ({
  children,
  type
}) => {
  const [keystore, setKeystore] = useState<JsonKeystore | null>(
    type === 'claimer' ? initClaimerKeystore : initAttesterKeystore
  );

  const addKeystore = useCallback(
    (mnemonic: string, passphrase?: string): KeyringPair$JsonExtra => {
      const json: KeyringPair$JsonExtra = {
        ...createAccount(
          mnemonic,
          {
            type
          },
          'sr25519'
        ).toJson(passphrase),
        extra: createAccount(
          mnemonic,
          {
            type
          },
          'ed25519'
        ).toJson(passphrase)
      };
      const key = `${PREFIX}:${type}:${json.address}`;

      localStorage.setItem(key, JSON.stringify(json));

      const keystore = new JsonKeystore(json);

      keystore.unlock(passphrase);

      setKeystore(keystore);

      return json;
    },
    [type]
  );

  const restoreKeystore = useCallback(
    (text: string, passphrase?: string) => {
      const json = JSON.parse(text) as KeyringPair$JsonExtra;
      const keystore = new JsonKeystore(json);

      // try unlock
      keystore.unlock(passphrase);

      const key = `${PREFIX}:${type}:${json.address}`;

      localStorage.setItem(key, JSON.stringify(json));

      setKeystore(keystore);
    },
    [type]
  );

  return (
    <KeystoreContext.Provider value={{ keystore, addKeystore, restoreKeystore, type }}>
      {children}
    </KeystoreContext.Provider>
  );
};

export function useKeystore() {
  const context = useContext(KeystoreContext);

  return context;
}

export default React.memo<typeof KeystoreProvider>(KeystoreProvider);
