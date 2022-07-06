import { DidUri, MessageBodyType } from '@kiltprotocol/sdk-js';
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';

import { CredentialData } from '@credential/app-db';

export function useUnread(db: CredentialData, receiver?: DidUri) {
  const allUnread = useLiveQuery(() =>
    db.message.filter((message) => !message.isRead && message.receiver === receiver).count()
  );
  const taskUnread = useLiveQuery(() =>
    db.message
      .filter(
        (message) =>
          !message.isRead &&
          message.body.type === MessageBodyType.REQUEST_ATTESTATION &&
          message.receiver === receiver
      )
      .count()
  );
  const messageUnread = useLiveQuery(() =>
    db.message
      .filter(
        (message) =>
          !message.isRead &&
          message.body.type !== MessageBodyType.REQUEST_ATTESTATION &&
          message.receiver === receiver
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
