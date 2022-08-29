import type { DidUri, Hash } from '@kiltprotocol/types';

import { CType as CTypeKilt } from '@kiltprotocol/sdk-js';
import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { CType } from '@credential/app-db/ctype';
import { useDerivedDid } from '@credential/react-dids';
import { useCTypes } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

import { AppContext } from '../AppProvider';

interface State {
  cTypeList: CType[];
  importCType: (hash: Hash) => void;
  deleteCType: (hash: Hash) => void;
}

export const CTypeContext = createContext<State>({} as State);

const CTypeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { fetcher } = useContext(AppContext);
  const did = useDerivedDid();
  const cTypeList = useCTypes();

  const importCType = useCallback(
    async (hash: Hash) => {
      if (!did || !fetcher) return;

      await credentialApi.importCtype(did.uri, hash);
      await credentialApi.getCtypes(did.uri).then(({ data }) => {
        fetcher.write.ctypes.batchPut(
          data.map((d) => {
            const ctype = CTypeKilt.fromSchema(d.metadata as CType['schema'], d.owner as any);

            return {
              ...ctype,
              description: d.description,
              type: d.type
            };
          })
        );
      });
    },
    [did, fetcher]
  );

  const deleteCType = useCallback(
    async (hash: Hash) => {
      if (!did || !fetcher) return;

      fetcher.write.ctypes.delete(hash);
      await credentialApi.deleteCtype(did.uri, hash);
      await credentialApi.getCtypes(did.uri).then(({ data }) => {
        fetcher.write.ctypes.batchPut(
          data.map((d) => ({
            hash: d.ctypeHash as Hash,
            owner: d.owner as DidUri,
            schema: d.metadata as CType['schema'],
            description: d.description,
            type: d.type
          }))
        );
      });
    },
    [did, fetcher]
  );

  const value = useMemo(() => {
    return {
      importCType,
      deleteCType,
      cTypeList
    };
  }, [cTypeList, deleteCType, importCType]);

  return <CTypeContext.Provider value={value}>{children}</CTypeContext.Provider>;
};

export default React.memo<typeof CTypeProvider>(CTypeProvider);
