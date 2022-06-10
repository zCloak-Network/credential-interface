import type { ICredential } from '@kiltprotocol/sdk-js';

import React, { createContext, useCallback, useMemo } from 'react';

import { useLocalStorage } from '@credential/react-hooks';

interface State {
  credentials: ICredential[];
  addCredential: (credential: ICredential) => void;
}

export const CredentialContenxt = createContext<State>({} as State);

const CREDENTIAL_STORATE_KEY = 'credential:credentials';

const CredentialProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [credentials, setCredentials] = useLocalStorage<ICredential[]>(CREDENTIAL_STORATE_KEY, []);

  const addCredential = useCallback(
    (credential: ICredential) => {
      setCredentials((credentials) => {
        const hasCredential = credentials.some((value) => {
          return value.request.rootHash === credential.request.rootHash;
        });

        if (hasCredential) {
          return credentials;
        } else {
          return [...credentials, credential];
        }
      });
    },
    [setCredentials]
  );

  const value = useMemo(() => ({ credentials, addCredential }), [addCredential, credentials]);

  return <CredentialContenxt.Provider value={value}>{children}</CredentialContenxt.Provider>;
};

export default React.memo<typeof CredentialProvider>(CredentialProvider);
