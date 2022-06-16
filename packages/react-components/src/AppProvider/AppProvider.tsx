import React, { createContext, useCallback, useMemo } from 'react';

import { Attester } from '@zcloak/credential-core';

import { createCredentialDb, CredentialData } from '@credential/app-db';
import { MessageSync } from '@credential/app-sync';
import { useInterval } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

import { useDids } from '../DidsProvider';

interface State {
  db: CredentialData;
  sync: () => Promise<void>;
}

export const AppContext = createContext({} as State);

const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { account, dids } = useDids();

  const db = useMemo(() => {
    return createCredentialDb(account);
  }, [account]);

  const sync = useCallback(async () => {
    const didDetails = dids instanceof Attester ? dids.fullDidDetails : dids.didDetails;

    const encryptionKey = didDetails?.encryptionKey;

    if (!dids.isLocked && didDetails && encryptionKey) {
      const messageSync = new MessageSync(
        {
          getMessage: async (id: number, _, length?: number) => {
            const receiverRes = await credentialApi.getMessages({
              receiverKeyId: didDetails.assembleKeyId(encryptionKey.id),
              size: length,
              start_id: String(id)
            });

            const data = receiverRes.data ?? [];

            return data.map((d) => ({ ...d, id: Number(d.id) }));
          }
        },
        (data) => {
          return dids.decryptMessage(data);
        },
        db,
        didDetails.did
      );

      await messageSync.sync();
    }
  }, [db, dids]);

  useInterval(sync, 30000);

  return <AppContext.Provider value={{ db, sync }}>{children}</AppContext.Provider>;
};

export default AppProvider;
