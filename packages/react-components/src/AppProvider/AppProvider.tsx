import type { CredentialInterface } from '@credential/app-db/types';

import { Message } from '@kiltprotocol/sdk-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { CredentialFetcher } from '@credential/app-db';
import { SyncProvider } from '@credential/app-sync';
import { MessageType } from '@credential/app-sync/type';
import { DidsContext, useDerivedDid } from '@credential/react-dids';
import { didManager } from '@credential/react-dids/initManager';

interface State {
  fetcher: CredentialInterface | null;
  unParsed: number;
  parse: () => Promise<void>;
}

export const AppContext = createContext({} as State);

const syncProvider = new SyncProvider(endpoint.messageWs);

const encryptedMessages = new Map<number, MessageType>();

const AppProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { isLocked, unlock } = useContext(DidsContext);
  const [unParsed, setUnParsed] = useState(0);
  const didDetails = useDerivedDid();

  const { address, fetcher } = useMemo(
    () => ({
      address: didDetails?.identifier,
      fetcher:
        didDetails && didDetails.encryptionKey
          ? new CredentialFetcher(
              `${endpoint.name}-${didDetails.assembleKeyUri(didDetails.encryptionKey.id)}`
            )
          : null
    }),
    [didDetails]
  );

  useEffect(() => {
    if (!fetcher || !address) return;

    const onConnected = async () => {
      // transform old messages syncId
      // old socket sent error type, the right type is number
      await fetcher.query.messages
        .all((message) => typeof message.syncId === 'string')
        .then((messages) =>
          fetcher.write.messages.batchPut(
            messages.map((message) => ({
              ...message,
              syncId:
                message.syncId !== undefined && message.syncId !== null
                  ? Number(message.syncId)
                  : undefined
            }))
          )
        );
      fetcher.query.messages.lastSync().then((message) => {
        syncProvider.subscribe(address, !message?.syncId ? 0 : message.syncId, (messages) => {
          messages.forEach((message) => encryptedMessages.set(message.id, message));
          setUnParsed(encryptedMessages.size);
        });
      });
    };

    syncProvider.on('connect', onConnected);
    syncProvider.open();

    return () => {
      encryptedMessages.clear();
      setUnParsed(0);
      syncProvider.off('connect', onConnected);
      syncProvider.close();
    };
  }, [address, fetcher]);

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
            didManager,
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
  }, [didDetails, isLocked, unlock, fetcher]);

  return <AppContext.Provider value={{ fetcher, unParsed, parse }}>{children}</AppContext.Provider>;
};

export default AppProvider;
