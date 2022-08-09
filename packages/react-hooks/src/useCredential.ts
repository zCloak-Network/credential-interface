import { Hash, IRequestAttestation, MessageBody, MessageBodyType } from '@kiltprotocol/sdk-js';
import { useCallback, useMemo } from 'react';

import { Message } from '@credential/app-db/message';

import { useAttestation } from './useAttestation';
import { useMessages } from './useMessage';

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

export function useCredential(rootHash?: Hash | null) {
  const request = useRequest(rootHash);
  const attestation = useAttestation(rootHash);

  return useMemo(
    () =>
      request && attestation
        ? {
            request: request.body.content.requestForAttestation,
            attestation: attestation
          }
        : null,
    [attestation, request]
  );
}
