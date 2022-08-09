import { useLiveQuery } from 'dexie-react-hooks';
import { useContext, useMemo } from 'react';

import { AppContext } from '@credential/react-components';

export function useCTypes() {
  const { fetcher } = useContext(AppContext);
  const data = useLiveQuery(() => fetcher?.query.ctypes.all(), [fetcher]);

  return useMemo(() => data || [], [data]);
}
