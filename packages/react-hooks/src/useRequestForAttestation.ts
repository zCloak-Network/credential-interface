import type { DidUri } from '@kiltprotocol/types';

import { useLiveQuery } from 'dexie-react-hooks';

import { CredentialData } from '@credential/app-db';

import { useDebounce } from '.';

export function useRequestForAttestation(db: CredentialData, owner?: DidUri) {
  const data = useLiveQuery(
    () =>
      owner
        ? db.requestForAttestation.filter((data) => data.claim.owner === owner).toArray()
        : db.requestForAttestation.toArray(),
    [owner]
  );

  return useDebounce(data, 300);
}

export function useRequest(db: CredentialData, rootHash?: string) {
  const data = useLiveQuery(
    () =>
      db.requestForAttestation.get({
        rootHash
      }),
    [rootHash]
  );

  return useDebounce(data, 300);
}