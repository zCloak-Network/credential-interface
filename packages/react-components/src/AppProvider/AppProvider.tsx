import { Message } from '@kiltprotocol/sdk-js';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { SyncProvider } from '@credential/app-sync';
import { MessageType } from '@credential/app-sync/type';
import { DidsContext, useDidDetails } from '@credential/react-dids';
import { useKeystore } from '@credential/react-keystore';
import { unlock } from '@credential/react-keystore/KeystoreProvider';

interface State {
  unParsed: number;
  parse: () => Promise<void>;
}

export const AppContext = createContext({} as State);

const syncProvider = new SyncProvider(endpoint.messageWs);

const encryptedMessages = new Map<number, MessageType>();

const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { keyring } = useKeystore();
  const { didUri, isLocked } = useContext(DidsContext);
  const didDetails = useDidDetails(didUri);
  const [unParsed, setUnParsed] = useState(0);

  useEffect(() => {
    if (didDetails) {
      endpoint.db.message
        .orderBy('syncId')
        .reverse()
        .filter((data) => {
          return didDetails.uri === data.receiver;
        })
        .first()
        .then((message) => {
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

    return () => encryptedMessages.clear();
  }, [didDetails]);

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
            return endpoint.db.message
              .put(
                {
                  ...message,
                  syncId: encryptedMessage.id,
                  deal: 0,
                  isRead: 0
                },
                ['messageId']
              )
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
  }, [didDetails, isLocked, keyring]);

  return <AppContext.Provider value={{ unParsed, parse }}>{children}</AppContext.Provider>;
};

export default AppProvider;
