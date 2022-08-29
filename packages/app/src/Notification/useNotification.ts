import { IRequestAttestation, MessageBody, MessageBodyType } from '@kiltprotocol/sdk-js';
import { useCallback, useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { useDerivedDid } from '@credential/react-dids';
import { useMessages } from '@credential/react-hooks';

export type UseNotification = {
  all: Message<MessageBody>[];
  task: Message<IRequestAttestation>[];
  message: Message<MessageBody>[];
  allUnread: number;
  taskUnread: number;
  messageUnread: number;
};

export function useNotification(): UseNotification {
  const did = useDerivedDid();
  const getAll = useCallback(
    (message: Message<MessageBody>) => message.receiver === did?.uri,
    [did?.uri]
  );

  const all = useMessages<MessageBody>(getAll);
  const task = useMemo(
    (): Message<IRequestAttestation>[] =>
      all.filter(
        (message) => message.body.type === MessageBodyType.REQUEST_ATTESTATION
      ) as Message<IRequestAttestation>[],
    [all]
  );
  const message = useMemo(
    (): Message<MessageBody>[] =>
      all.filter((message) =>
        [
          MessageBodyType.SUBMIT_ATTESTATION,
          MessageBodyType.REJECT_ATTESTATION,
          MessageBodyType.SUBMIT_CREDENTIAL,
          MessageBodyType.ACCEPT_CREDENTIAL,
          MessageBodyType.REJECT_CREDENTIAL
        ].includes(message.body.type)
      ),
    [all]
  );

  return useMemo(
    () => ({
      all,
      task,
      message,
      allUnread: all.filter((message) => !message.isRead).length,
      taskUnread: task.filter((message) => !message.isRead).length,
      messageUnread: message.filter((message) => !message.isRead).length
    }),
    [all, message, task]
  );
}
