import type { DidUri } from '@kiltprotocol/types';

import { useLiveQuery } from 'dexie-react-hooks';

import { CredentialData } from '@credential/app-db';

import { useDebounce } from '.';

export function useRequestForAttestation(db: CredentialData, sender?: DidUri) {
  const data = useLiveQuery(
    () =>
      sender
        ? db.requestForAttestation.filter((data) => data.claim.owner === sender).toArray()
        : db.requestForAttestation.toArray(),
    [sender]
  );

  return useDebounce(data, 300);
}
