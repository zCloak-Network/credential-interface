import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';

import { CredentialData } from '@credential/app-db';
import { Message } from '@credential/app-db/message';

import { useDebounce } from '.';

export function useMessage(db: CredentialData, messageId: string) {
  const data = useLiveQuery(
    () =>
      db.message.get({
        messageId
      }),
    [messageId]
  );

  return useDebounce(data, 300);
}

export function useMessageLinked(db: CredentialData, messageId: string) {
  const getMessageLinked = useCallback(async () => {
    const messages: Message[] = [];

    let message = await db.message.get({ messageId });

    while (message) {
      messages.push(message);
      message = await db.message.get({ inReplyTo: message.messageId });
    }

    return messages;
  }, [db.message, messageId]);

  const data = useLiveQuery(() => getMessageLinked(), [getMessageLinked]);

  return useDebounce(data, 300);
}
