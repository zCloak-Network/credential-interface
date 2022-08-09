import { DidUri, IRequestAttestation, MessageBody, MessageBodyType } from '@kiltprotocol/sdk-js';
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
