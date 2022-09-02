import {
  DidUri,
  Hash,
  IRequestAttestation,
  MessageBody,
  MessageBodyType
} from '@kiltprotocol/sdk-js';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useContext, useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { AppContext } from '@credential/react-components';

export function useMessages<Body extends MessageBody>(
  filter?: (message: Message<MessageBody>) => boolean
) {
  const { fetcher } = useContext(AppContext);
  const getMessages = useCallback(() => fetcher?.query.messages.all(filter), [fetcher, filter]);

  const data = useLiveQuery(getMessages, [getMessages]);

  return useMemo(() => {
    if (data) {
      return data as Message<Body>[];
    } else {
      return [];
    }
  }, [data]);
}

export function useReferenceMessages<Body extends MessageBody>(
  referrences?: (string | undefined)[]
) {
  const filter = useCallback(
    (message: Message<MessageBody>) => {
      return !!message.messageId && !!referrences?.includes(message.messageId);
    },
    [referrences]
  );

  return useMessages<Body>(filter);
}

export function useAttesterRequests(attester?: DidUri) {
  const filter = useCallback(
    (message: Message<MessageBody>): boolean => {
      if (!attester) return false;

      return (
        message.body.type === MessageBodyType.REQUEST_ATTESTATION && message.receiver === attester
      );
    },
    [attester]
  );

  return useMessages<IRequestAttestation>(filter);
}

export function useClaimerRequests(claimer?: DidUri) {
  const filter = useCallback(
    (message: Message<MessageBody>): boolean => {
      if (!claimer) return false;

      return (
        message.body.type === MessageBodyType.REQUEST_ATTESTATION && message.sender === claimer
      );
    },
    [claimer]
  );

  return useMessages<IRequestAttestation>(filter);
}

export function useRequest(rootHash?: Hash | null) {
  const filter = useCallback(
    (message: Message<MessageBody>): boolean => {
      return (
        message.body.type === MessageBodyType.REQUEST_ATTESTATION &&
        message.body.content.requestForAttestation.rootHash === rootHash
      );
    },
    [rootHash]
  );

  const messages = useMessages<IRequestAttestation>(filter);

  return useMemo(() => (messages.length > 0 ? messages[0] : null), [messages]);
}
