import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';

import { CredentialData } from '@credential/app-db';

export function useCTypes(db: CredentialData) {
  const data = useLiveQuery(() => db.ctype.toArray());

  return useMemo(() => data || [], [data]);
}
