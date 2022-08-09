import { MessageBodyType } from '@kiltprotocol/sdk-js';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useContext, useMemo } from 'react';

import { AppContext } from '@credential/react-components';

export function useUnread() {
  const { fetcher } = useContext(AppContext);
  const getAllUnread = useCallback(() => fetcher?.query.messages.all(), [fetcher]);
  const getTaskUnread = useCallback(
    () =>
      fetcher?.query.messages.all((message) =>
        [MessageBodyType.REQUEST_ATTESTATION].includes(message.body.type)
      ),
    [fetcher]
  );
  const getMessageUnread = useCallback(
    () =>
      fetcher?.query.messages.all((message) =>
        [
          MessageBodyType.SUBMIT_ATTESTATION,
          MessageBodyType.REJECT_ATTESTATION,
          MessageBodyType.SUBMIT_CREDENTIAL
        ].includes(message.body.type)
      ),
    [fetcher]
  );

  const allUnread = useLiveQuery(() => getAllUnread(), [getAllUnread]);
  const taskUnread = useLiveQuery(() => getTaskUnread(), [getTaskUnread]);
  const messageUnread = useLiveQuery(() => getMessageUnread(), [getMessageUnread]);

  return useMemo(
    () => ({
      allUnread,
      taskUnread,
      messageUnread
    }),
    [allUnread, messageUnread, taskUnread]
  );
}

export function useUnreadCount() {
  const { fetcher } = useContext(AppContext);
  const getAllUnread = useCallback(() => fetcher?.query.messages.unreadCount(), [fetcher]);
  const getTaskUnread = useCallback(
    () =>
      fetcher?.query.messages.unreadCount((message) =>
        [MessageBodyType.REQUEST_ATTESTATION].includes(message.body.type)
      ),
    [fetcher]
  );
  const getMessageUnread = useCallback(
    () =>
      fetcher?.query.messages.unreadCount((message) =>
        [
          MessageBodyType.SUBMIT_ATTESTATION,
          MessageBodyType.REJECT_ATTESTATION,
          MessageBodyType.SUBMIT_CREDENTIAL
        ].includes(message.body.type)
      ),
    [fetcher]
  );

  const allUnread = useLiveQuery(() => getAllUnread(), [getAllUnread]);
  const taskUnread = useLiveQuery(() => getTaskUnread(), [getTaskUnread]);
  const messageUnread = useLiveQuery(() => getMessageUnread(), [getMessageUnread]);

  return useMemo(
    () => ({
      allUnread,
      taskUnread,
      messageUnread
    }),
    [allUnread, messageUnread, taskUnread]
  );
}
