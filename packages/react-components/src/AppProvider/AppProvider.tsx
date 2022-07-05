import React, { createContext, useCallback, useContext, useEffect } from 'react';

import { credentialDb } from '@credential/app-db';
import { MessageSync } from '@credential/app-sync';
import { IDataSource } from '@credential/app-sync/type';
import { DidsContext, useDidDetails } from '@credential/react-dids';
import { credentialApi } from '@credential/react-hooks/api';
import { useKeystore } from '@credential/react-keystore';

interface State {
  parse: () => Promise<void>;
}

export const AppContext = createContext({} as State);

let messageSync: MessageSync | null = null;

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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function syncMessage() {
  while (true) {
    if (messageSync) {
      await messageSync.syncMessage();
    }

    await sleep(30000);
  }
}

syncMessage();

const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { keyring } = useKeystore();
  const { didUri } = useContext(DidsContext);
  const didDetails = useDidDetails(didUri);

  useEffect(() => {
    if (didDetails && didDetails.encryptionKey && messageSync === null) {
      messageSync = new MessageSync(
        dataSource,
        credentialDb,
        didDetails.assembleKeyUri(didDetails.encryptionKey.id)
      );
    }
  }, [didDetails]);

  const parse = useCallback(async () => {
    if (didDetails) {
      await messageSync?.parse(keyring, didDetails);
    }
  }, [didDetails, keyring]);

  return <AppContext.Provider value={{ parse }}>{children}</AppContext.Provider>;
};

export default AppProvider;
