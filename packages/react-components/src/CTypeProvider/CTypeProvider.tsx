import type { DidUri, Hash, ICType } from '@kiltprotocol/types';

import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { DidsContext } from '@credential/react-dids';
import { useCTypes } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

import { AppContext } from '../AppProvider';

interface State {
  cTypeList: ICType[];
  importCType: (hash: string) => void;
}

export const CTypeContext = createContext<State>({} as State);

const CTypeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { fetcher } = useContext(AppContext);
  const { didUri } = useContext(DidsContext);
  const cTypeList = useCTypes();

  const importCType = useCallback(
    (hash: string) => {
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

  const value = useMemo(() => {
    return {
      importCType,
      cTypeList
    };
  }, [cTypeList, importCType]);

  return <CTypeContext.Provider value={value}>{children}</CTypeContext.Provider>;
};

export default React.memo<typeof CTypeProvider>(CTypeProvider);
