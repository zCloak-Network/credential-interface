import { useLiveQuery } from 'dexie-react-hooks';

import { CredentialData } from '@credential/app-db';

import { useDebounce } from '.';

export function useRequestForAttestation(db: CredentialData) {
  const data = useLiveQuery(() => db.requestForAttestation.toArray());

  return useDebounce(data, 300);
}
