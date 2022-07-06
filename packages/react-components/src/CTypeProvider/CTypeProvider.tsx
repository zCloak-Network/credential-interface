import type { DidUri } from '@kiltprotocol/types';

import { CType } from '@kiltprotocol/sdk-js';
import React, { createContext, useCallback, useEffect, useMemo } from 'react';

import { useLocalStorage } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

interface State {
  cTypeList: CType[];
  importCType: (hash: string) => void;
}

export const CTypeContext = createContext<State>({} as State);

const STORAGE_KEY = 'credential:ctypes';

const CTypeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cTypeList, setCTypeList] = useLocalStorage<CType[]>(STORAGE_KEY, []);

  const importCType = useCallback(
    (hash: string) => {
      const has = !!cTypeList.find(({ hash: _hash }) => _hash === hash);

      if (has) return;

      credentialApi.getCType(hash).then((res) => {
        setCTypeList((value) => [
          CType.fromSchema(res.data.metadata as CType['schema'], res.data.owner as DidUri),
          ...value
        ]);
      });
    },
    [cTypeList, setCTypeList]
  );

  useEffect(() => {
    if (cTypeList.length === 0) {
      credentialApi
        .getCTypes()
        .then((res) =>
          setCTypeList(
            res.data.map(({ metadata, owner }) =>
              CType.fromSchema(metadata as CType['schema'], owner as DidUri)
            )
          )
        );
    }
  }, [cTypeList.length, setCTypeList]);

  const value = useMemo(() => {
    return {
      importCType,
      cTypeList
    };
  }, [cTypeList, importCType]);

  return <CTypeContext.Provider value={value}>{children}</CTypeContext.Provider>;
};

export default React.memo<typeof CTypeProvider>(CTypeProvider);
