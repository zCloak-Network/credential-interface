import { DidUri, MessageBodyType } from '@kiltprotocol/types';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';

import { CredentialData } from '@credential/app-db';
import { Message } from '@credential/app-db/message';

import { useDebounce } from '.';

export function useRequestMessages(db: CredentialData, rootHash: string) {
  const getRequestMessages = useCallback(async () => {
    const messages = db.message
      .orderBy('createdAt')
      .reverse()
      .filter((message) => {
        if (message.body.type === MessageBodyType.REQUEST_ATTESTATION) {
          return message.body.content.requestForAttestation.rootHash === rootHash;
        }

        if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION) {
          return message.body.content.attestation.claimHash === rootHash;
        }

        if (message.body.type === MessageBodyType.REJECT_ATTESTATION) {
          return message.body.content === rootHash;
        }

        return false;
      })
      .toArray();

    return messages;
  }, [db.message, rootHash]);

  const data = useLiveQuery(() => getRequestMessages(), [getRequestMessages]);

  return useDebounce(data, 100);
}

export function useMessages(
  db: CredentialData,
  filter?: { sender?: DidUri; receiver?: DidUri; bodyTypes?: MessageBodyType[] }
) {
  const getMessages = useCallback(async () => {
    if (!filter) return [];

    const wheres: Partial<Pick<Message, 'sender' | 'receiver'>> = {};

    if (filter.sender) {
      wheres.sender = filter.sender;
    }

    if (filter.receiver) {
      wheres.receiver = filter.receiver;
    }

    return db.message
      .where(wheres)
      .filter((message) => {
        let flag = true;

        if (filter.bodyTypes) {
          flag = flag && filter.bodyTypes.includes(message.body.type);
        }

        return flag;
      })
      .sortBy('createdAt', (messages) => messages.reverse());
  }, [db, filter]);

  const data = useLiveQuery(() => getMessages(), [getMessages]);

  return useDebounce(data, 100);
}
