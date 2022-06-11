import type { ICredential } from '@kiltprotocol/sdk-js';

import { Credential } from '@kiltprotocol/sdk-js';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { useLocalStorage } from '@credential/react-hooks';

interface State {
  credentials: ICredential[];
  verifiedCredentials: ICredential[];
  addCredential: (credential: ICredential) => void;
}

export const CredentialContenxt = createContext<State>({} as State);

const CREDENTIAL_STORATE_KEY = 'credential:credentials';

const CredentialProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [credentials, setCredentials] = useLocalStorage<ICredential[]>(CREDENTIAL_STORATE_KEY, []);
  const [verifiedCredentials, setVerifiedCredentials] = useState<ICredential[]>([]);

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

  useEffect(() => {
    Promise.all(
      credentials.map((credential) => Credential.fromCredential(credential).verify())
    ).then((verifiedData) => {
      setVerifiedCredentials(credentials.filter((_, index) => verifiedData[index]) || []);
    });
  }, [credentials]);

  const value = useMemo(
    () => ({ credentials, verifiedCredentials, addCredential }),
    [addCredential, credentials, verifiedCredentials]
  );

  return <CredentialContenxt.Provider value={value}>{children}</CredentialContenxt.Provider>;
};

export default React.memo<typeof CredentialProvider>(CredentialProvider);
