import type { ICredential } from '@kiltprotocol/sdk-js';
import type { CredentialType, VerifiedCredentialType } from './types';

import { Attestation, Credential } from '@kiltprotocol/sdk-js';
import React, { createContext, useCallback, useMemo } from 'react';

import { useInterval, useLocalStorage } from '@credential/react-hooks';

interface State {
  credentials: CredentialType[];
  verifiedCredentials: VerifiedCredentialType[];
  addCredential: (credential: ICredential) => void;
}

export const CredentialContenxt = createContext<State>({} as State);

const CREDENTIAL_STORATE_KEY = 'credential:credentials';

const CredentialProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [credentials, setCredentials] = useLocalStorage<CredentialType[]>(
    CREDENTIAL_STORATE_KEY,
    []
  );

  const addCredential = useCallback(
    (credential: ICredential) => {
      setCredentials((credentials) => {
        const hasCredential = credentials.some((value) => {
          return value.credential.request.rootHash === credential.request.rootHash;
        });

        if (hasCredential) {
          return credentials;
        } else {
          return [
            ...credentials,
            {
              credential,
              verified: false,
              revoked: false,
              hash: credential.attestation.claimHash,
              timestamp: Date.now()
            }
          ];
        }
      });
    },
    [setCredentials]
  );

  const updateCredentials = useCallback(() => {
    Promise.all(
      credentials.map(({ credential }) =>
        Promise.all([
          Credential.fromCredential(credential).verify(),
          Attestation.query(credential.attestation.claimHash)
        ])
      )
    ).then((data) => {
      setCredentials(
        credentials.map((credential, index) => {
          const newCredential = Credential.fromCredential({
            attestation: data?.[index]?.[1] || credential.credential.attestation,
            request: credential.credential.request
          });

          return {
            timestamp: credential.timestamp,
            credential: newCredential,
            verified: data[index][0] || false,
            revoked: newCredential.attestation.revoked,
            hash: newCredential.attestation.claimHash
          };
        })
      );
    });
  }, [credentials, setCredentials]);

  useInterval(updateCredentials, 30000, false);

  const value = useMemo(
    () => ({
      credentials,
      verifiedCredentials: credentials.filter(
        (credential) => credential.verified
      ) as VerifiedCredentialType[],
      addCredential
    }),
    [addCredential, credentials]
  );

  return <CredentialContenxt.Provider value={value}>{children}</CredentialContenxt.Provider>;
};

export default React.memo<typeof CredentialProvider>(CredentialProvider);
