import type { Credential } from '@credential/app-db/credential';

import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useContext, useMemo } from 'react';

import { AppContext } from '@credential/react-components';

export function useCredentials(filter?: (message: Credential) => boolean) {
  const { fetcher } = useContext(AppContext);
  const getCredentials = useCallback(
    () => fetcher?.query.credential.all(filter),
    [fetcher, filter]
  );

  const data = useLiveQuery(getCredentials, [getCredentials]);

  return useMemo(() => data || [], [data]);
}
