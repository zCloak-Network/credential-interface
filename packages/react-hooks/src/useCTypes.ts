import { CType as CTypeKilt, DidUri } from '@kiltprotocol/sdk-js';
import { useLiveQuery } from 'dexie-react-hooks';
import { useContext, useEffect, useMemo } from 'react';

import { CType } from '@credential/app-db/ctype';
import { AppContext } from '@credential/react-components';
import { useDerivedDid } from '@credential/react-dids';

import { credentialApi } from './api';

export function useCTypes() {
  const { fetcher } = useContext(AppContext);
  const did = useDerivedDid();
  const data = useLiveQuery(() => fetcher?.query.ctypes.all(), [fetcher]);

  useEffect(() => {
    if (did && fetcher) {
      credentialApi.getCtypes(did.uri).then(({ data }) => {
        fetcher.write.ctypes.batchPut(
          data.map((d) => {
            const ctype = CTypeKilt.fromSchema(d.metadata as CType['schema'], d.owner as DidUri);

            return {
              ...ctype,
              description: d.description,
              type: d.type
            };
          })
        );
      });
    }
  }, [did, fetcher]);

  return useMemo(() => data || [], [data]);
}
