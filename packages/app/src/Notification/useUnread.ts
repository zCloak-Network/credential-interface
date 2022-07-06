import { MessageBodyType } from '@kiltprotocol/sdk-js';
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';

import { CredentialData } from '@credential/app-db';

export function useUnread(db: CredentialData) {
  const allUnread = useLiveQuery(() => db.message.filter((message) => !message.isRead).count());
  const taskUnread = useLiveQuery(() =>
    db.message
      .filter(
        (message) => !message.isRead && message.body.type === MessageBodyType.REQUEST_ATTESTATION
      )
      .count()
  );
  const messageUnread = useLiveQuery(() =>
    db.message
      .filter(
        (message) => !message.isRead && message.body.type !== MessageBodyType.REQUEST_ATTESTATION
      )
      .count()
  );

  return useMemo(
    () => ({
      allUnread,
      taskUnread,
      messageUnread
    }),
    [allUnread, messageUnread, taskUnread]
  );
}
