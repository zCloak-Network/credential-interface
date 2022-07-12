import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { credentialDb } from '@credential/app-db';
import { MessageSync } from '@credential/app-sync';
import { IDataSource } from '@credential/app-sync/type';
import { DidsContext, useDidDetails } from '@credential/react-dids';
import { credentialApi } from '@credential/react-hooks/api';
import { useKeystore } from '@credential/react-keystore';
import { unlock } from '@credential/react-keystore/KeystoreProvider';

interface State {
  unParsed: number;
  parse: () => Promise<void>;
}

export const AppContext = createContext({} as State);
const dataSource: IDataSource = {
  async getMessage(id, uri, length?) {
    const receiverRes = await credentialApi.getMessages({
      receiverKeyId: uri,
      size: length,
      start_id: String(id)
    });

    const data = receiverRes.data ?? [];

    return data.map((d) => ({ ...d, id: Number(d.id) }));
  }
};
const messageSync: MessageSync = new MessageSync(dataSource, credentialDb);

const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { keyring } = useKeystore();
  const { didUri, isLocked } = useContext(DidsContext);
  const didDetails = useDidDetails(didUri);
  const [unParsed, setUnParsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (didDetails) {
        messageSync.syncMessage(didDetails).finally(() => {
          setUnParsed(messageSync.getEncryptMessages(didDetails).length);
        });
      }
    }, 30000);

    if (didDetails) {
      messageSync.syncMessage(didDetails).finally(() => {
        setUnParsed(messageSync.getEncryptMessages(didDetails).length);
      });
    }

    return () => clearInterval(interval);
  }, [didDetails]);

  const parse = useCallback(async () => {
    if (didDetails) {
      isLocked && (await unlock());
      await messageSync.parse(keyring, didDetails);
      setUnParsed(messageSync.getEncryptMessages(didDetails).length);
    }
  }, [didDetails, isLocked, keyring]);

  return <AppContext.Provider value={{ unParsed, parse }}>{children}</AppContext.Provider>;
};

export default AppProvider;
