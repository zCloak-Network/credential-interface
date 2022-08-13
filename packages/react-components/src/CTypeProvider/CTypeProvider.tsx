import type { DidUri, Hash, ICType } from '@kiltprotocol/types';

import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { CType } from '@credential/app-db/ctype';
import { DidsContext } from '@credential/react-dids';
import { useCTypes } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

import { AppContext } from '../AppProvider';

interface State {
  cTypeList: ICType[];
  importCType: (hash: Hash) => void;
  deleteCType: (hash: Hash) => void;
}

export const CTypeContext = createContext<State>({} as State);

const CTypeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { fetcher } = useContext(AppContext);
  const { didUri } = useContext(DidsContext);
  const cTypeList = useCTypes();

  const importCType = useCallback(
    (hash: Hash) => {
      if (!didUri) return;

      credentialApi.importCtype(didUri, hash);

      credentialApi.getCType(hash).then((res) => {
        fetcher?.write.ctypes.put({
          schema: res.data.metadata as ICType['schema'],
          owner: res.data.owner as DidUri,
          hash: res.data.ctypeHash as Hash
        });
      });
    },
    [didUri, fetcher?.write.ctypes]
  );

  const deleteCType = useCallback(
    async (hash: Hash) => {
      if (!didUri || !fetcher) return;

      fetcher.write.ctypes.delete(hash);
      await credentialApi.deleteCtype(didUri, hash);
      await credentialApi.getCtypes(didUri).then(({ data }) => {
        fetcher.write.ctypes.batchPut(
          data.map((d) => ({
            hash: d.ctypeHash as Hash,
            owner: d.owner as DidUri,
            schema: d.metadata as CType['schema'],
            description: d.description
          }))
        );
      });
    },
    [didUri, fetcher]
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
