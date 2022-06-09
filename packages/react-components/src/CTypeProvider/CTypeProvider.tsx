import React, { createContext, useEffect } from 'react';

import { useLocalStorage } from '@credential/react-hooks';

import { ICTypeMetadata } from './types';

interface State {
  cTypeList: ICTypeMetadata[];
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

  return <CTypeContext.Provider value={{ cTypeList }}>{children}</CTypeContext.Provider>;
};

export default React.memo<typeof CTypeProvider>(CTypeProvider);
