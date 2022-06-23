import type { DidUri } from '@kiltprotocol/types';

import { CType } from '@kiltprotocol/sdk-js';
import React, { createContext, useCallback, useEffect, useMemo } from 'react';

import { useLocalStorage } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

import { ICTypeMetadata, ICTypeSchema } from './types';

interface State {
  cTypeList: CType[];
  importCType: (hash: string) => void;
}

export const CTypeContext = createContext<State>({} as State);

const STORAGE_KEY = 'credential:ctypes';

const CTypeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cTypeList, setCTypeList] = useLocalStorage<ICTypeMetadata[]>(STORAGE_KEY, []);

  const importCType = useCallback(
    (hash: string) => {
      const has = !!cTypeList.find(({ ctypeHash }) => ctypeHash === hash);

      if (has) return;

      credentialApi.getCType(hash).then((res) => {
        setCTypeList((value) => [
          {
            owner: res.data.owner as DidUri,
            ctypeHash: res.data.ctypeHash,
            schema: res.data.metadata as ICTypeSchema
          },
          ...value
        ]);
      });
    },
    [cTypeList, setCTypeList]
  );

  useEffect(() => {
    if (cTypeList.length === 0) {
      credentialApi.getCTypes().then((res) =>
        setCTypeList(
          res.data.map(({ ctypeHash, metadata, owner }) => ({
            owner: owner as DidUri,
            ctypeHash,
            schema: metadata as ICTypeSchema
          }))
        )
      );
    }
  }, [cTypeList.length, setCTypeList]);

  const value = useMemo(() => {
    return {
      importCType,
      cTypeList: cTypeList.map((cType) => CType.fromSchema(cType.schema, cType.owner))
    };
  }, [cTypeList, importCType]);

  return <CTypeContext.Provider value={value}>{children}</CTypeContext.Provider>;
};

export default React.memo<typeof CTypeProvider>(CTypeProvider);
