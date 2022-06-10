import { CType } from '@kiltprotocol/sdk-js';
import React, { createContext, useEffect, useMemo } from 'react';

import { useLocalStorage } from '@credential/react-hooks';

import { ICTypeMetadata } from './types';

interface State {
  cTypeList: CType[];
}

export const CTypeContext = createContext<State>({} as State);

const STORAGE_KEY = 'credential:ctypes';

const CTypeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [cTypeList, setCTypeList] = useLocalStorage<ICTypeMetadata[]>(STORAGE_KEY, []);

  useEffect(() => {
    fetch('/ctypes.json')
      .then((data) => data.json())
      .then((data) => {
        setCTypeList(data.list);
      });
  }, [setCTypeList]);

  const value = useMemo(() => {
    return { cTypeList: cTypeList.map((cType) => CType.fromSchema(cType.schema, cType.owner)) };
  }, [cTypeList]);

  return <CTypeContext.Provider value={value}>{children}</CTypeContext.Provider>;
};

export default React.memo<typeof CTypeProvider>(CTypeProvider);
