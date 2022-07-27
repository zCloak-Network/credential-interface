import type { DidUri, Hash, ICType } from '@kiltprotocol/types';

import React, { createContext, useCallback, useMemo } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { useCTypes } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

interface State {
  cTypeList: ICType[];
  importCType: (hash: string) => void;
}

export const CTypeContext = createContext<State>({} as State);

const CTypeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const cTypeList = useCTypes(endpoint.db);

  const importCType = useCallback(
    (hash: string) => {
      const has = !!cTypeList?.find(({ hash: _hash }) => _hash === hash);

      if (has) return;

      credentialApi.getCType(hash).then((res) => {
        endpoint.db.ctype.put(
          {
            schema: res.data.metadata as ICType['schema'],
            owner: res.data.owner as DidUri,
            hash: res.data.ctypeHash as Hash
          },
          ['hash']
        );
      });
    },
    [cTypeList]
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
