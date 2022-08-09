import type { CredentialInterface } from '@credential/app-db/types';

import { Message } from '@kiltprotocol/sdk-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { CredentialFetcher } from '@credential/app-db';
import { SyncProvider } from '@credential/app-sync';
import { MessageType } from '@credential/app-sync/type';
import { DidsContext } from '@credential/react-dids';
import { useKeystore } from '@credential/react-keystore';
import { unlock } from '@credential/react-keystore/KeystoreProvider';

interface State {
  fetcher: CredentialInterface | null;
  unParsed: number;
  parse: () => Promise<void>;
}

export const AppContext = createContext({} as State);

const syncProvider = new SyncProvider(endpoint.messageWs);

const encryptedMessages = new Map<number, MessageType>();

const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { keyring } = useKeystore();
  const { didDetails, isLocked } = useContext(DidsContext);
  const [unParsed, setUnParsed] = useState(0);

  const fetcher = useMemo(() => {
    if (didDetails && didDetails.encryptionKey) {
      return new CredentialFetcher(
        `${endpoint.name}-${didDetails.assembleKeyUri(didDetails.encryptionKey.id)}`
      );
    }

    return null;
  }, [didDetails]);

  useEffect(() => {
    return () => {
      encryptedMessages.clear();
      setUnParsed(0);
    };
  }, [didDetails]);

  useEffect(() => {
    if (fetcher && didDetails) {
      fetcher.query.messages.lastSync().then((message) => {
        let startId: number;

        if (!message?.syncId) {
          startId = 0;
        } else {
          startId = message.syncId;
        }

        syncProvider.subscribe(didDetails, startId, (messages) => {
          messages.forEach((message) => encryptedMessages.set(message.id, message));
          setUnParsed(encryptedMessages.size);
        });
      });
    }
  }, [fetcher, didDetails]);

  const parse = useCallback(async () => {
    if (didDetails && encryptedMessages.size > 0) {
      isLocked && (await unlock());
      const promises: Promise<void>[] = [];

      encryptedMessages.forEach((encryptedMessage) => {
        promises.push(
          Message.decrypt(
            {
              receiverKeyUri: encryptedMessage.receiverKeyId as any,
              senderKeyUri: encryptedMessage.senderKeyId as any,
              ciphertext: encryptedMessage.ciphertext,
              nonce: encryptedMessage.nonce
            },
            keyring,
            didDetails
          ).then((message) => {
            return fetcher?.write.messages
              .put({
                ...message,
                syncId: encryptedMessage.id,
                isRead: 0
              })
              .then(() => {
                encryptedMessages.delete(encryptedMessage.id);
              });
          })
        );
      });

      Promise.all(promises).finally(() => {
        setUnParsed(encryptedMessages.size);
      });
    }
  }, [fetcher, didDetails, isLocked, keyring]);

  return <AppContext.Provider value={{ fetcher, unParsed, parse }}>{children}</AppContext.Provider>;
};

export default AppProvider;
