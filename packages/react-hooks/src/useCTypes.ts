import { DidUri, Hash } from '@kiltprotocol/sdk-js';
import { useLiveQuery } from 'dexie-react-hooks';
import { useContext, useEffect, useMemo } from 'react';

import { CType } from '@credential/app-db/ctype';
import { AppContext } from '@credential/react-components';
import { DidsContext } from '@credential/react-dids';

import { credentialApi } from './api';

export function useCTypes() {
  const { fetcher } = useContext(AppContext);
  const { didUri } = useContext(DidsContext);
  const data = useLiveQuery(() => fetcher?.query.ctypes.all(), [fetcher]);

  useEffect(() => {
    if (didUri && fetcher) {
      credentialApi.getCtypes(didUri).then(({ data }) => {
        fetcher.write.ctypes.batchPut(
          data.map((d) => ({
            hash: d.ctypeHash as Hash,
            owner: d.owner as DidUri,
            schema: d.metadata as CType['schema'],
            description: d.description
          }))
        );
      });
    }
  }, [didUri, fetcher]);

  return useMemo(() => data || [], [data]);
}
