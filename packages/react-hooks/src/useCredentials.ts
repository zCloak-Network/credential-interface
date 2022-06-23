import type { DidUri } from '@kiltprotocol/types';

import type { Attestation } from '@credential/app-db/attestation/Attestation';
import type { RequestForAttestation } from '@credential/app-db/requestForAttestation';

import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';

import { CredentialData } from '@credential/app-db';

import { useRequestForAttestation } from './useRequestForAttestation';
import { useDebounce } from '.';

export function useCredentials(db: CredentialData, owner?: DidUri) {
  const requests = useRequestForAttestation(db, owner);

  const getCredential = useCallback(async () => {
    if (!requests) return [];

    const attestations = await Promise.all(
      (requests ?? []).map((request) =>
        db.attestation.get({
          claimHash: request.rootHash
        })
      )
    );

    const credentials: { attestation?: Attestation; request: RequestForAttestation }[] =
      attestations.map((attestation, index) => ({
        request: requests[index],
        attestation
      }));

    return credentials;
  }, [db.attestation, requests]);

  const data = useLiveQuery(async () => {
    return getCredential();
  }, [getCredential]);

  return useDebounce(data, 300);
}
