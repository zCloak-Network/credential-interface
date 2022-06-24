import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';

import { CredentialData } from '@credential/app-db';

import { useDebounce } from '.';

export function useAttestation(db: CredentialData, claimHash?: string) {
  const getAttestation = useCallback(async () => {
    if (!claimHash) return undefined;

    return db.attestation.get({
      claimHash
    });
  }, [claimHash, db.attestation]);

  const data = useLiveQuery(async () => {
    return getAttestation();
  }, [getAttestation]);

  return useDebounce(data, 100);
}
