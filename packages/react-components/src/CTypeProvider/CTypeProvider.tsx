import { CType } from '@kiltprotocol/sdk-js';
import React, { createContext, useEffect, useMemo } from 'react';

import { useLocalStorage } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

import { ICTypeMetadata, ICTypeSchema } from './types';

interface State {
  cTypeList: CType[];
}

export const CTypeContext = createContext<State>({} as State);

const STORAGE_KEY = 'credential:ctypes';

const CTypeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cTypeList, setCTypeList] = useLocalStorage<ICTypeMetadata[]>(STORAGE_KEY, []);

  useEffect(() => {
    credentialApi.allCTypes({}).then((res) =>
      setCTypeList(
        res.data.map(({ ctypeHash, metadata, owner }) => ({
          owner,
          ctypeHash,
          schema: metadata as ICTypeSchema
        }))
      )
    );
  }, [setCTypeList]);

  const value = useMemo(() => {
    return { cTypeList: cTypeList.map((cType) => CType.fromSchema(cType.schema, cType.owner)) };
  }, [cTypeList]);

  return <CTypeContext.Provider value={value}>{children}</CTypeContext.Provider>;
};

export default React.memo<typeof CTypeProvider>(CTypeProvider);
