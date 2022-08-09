import {
  Hash,
  IRejectAttestation,
  ISubmitAttestation,
  MessageBody,
  MessageBodyType
} from '@kiltprotocol/sdk-js';
import { useCallback, useMemo } from 'react';

import { Message } from '@credential/app-db/message';

import { RequestStatus } from './types';
import { useAttestation } from './useAttestation';
import { useMessages } from './useMessage';

export function useRequestStatus(rootHash?: Hash): RequestStatus {
  const filter = useCallback(
    (message: Message<MessageBody>): boolean => {
      if (!rootHash) return false;

      if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION) {
        return message.body.content.attestation.claimHash === rootHash;
      }

      if (message.body.type === MessageBodyType.REJECT_ATTESTATION) {
        return message.body.content === rootHash;
      }

      return false;
    },
    [rootHash]
  );

  const messages = useMessages<ISubmitAttestation | IRejectAttestation>(filter);

  const status =
    messages.length > 0
      ? messages[0].body.type === MessageBodyType.SUBMIT_ATTESTATION
        ? RequestStatus.SUBMIT
        : RequestStatus.REJECT
      : RequestStatus.INIT;

  const attestation = useAttestation(rootHash);

  return useMemo(() => {
    if (attestation) {
      return RequestStatus.SUBMIT;
    } else {
      return status;
    }
  }, [attestation, status]);
}
