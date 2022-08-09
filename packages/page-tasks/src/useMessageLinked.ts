import {
  Hash,
  IRejectAttestation,
  IRequestAttestation,
  ISubmitAttestation,
  MessageBody,
  MessageBodyType
} from '@kiltprotocol/sdk-js';
import { useCallback } from 'react';

import { Message } from '@credential/app-db/message';
import { useMessages } from '@credential/react-hooks';

export function useMessageLinked(rootHash: Hash) {
  const filter = useCallback(
    (message: Message<MessageBody>): boolean => {
      if (message.body.type === MessageBodyType.REQUEST_ATTESTATION) {
        return rootHash === message.body.content.requestForAttestation.rootHash;
      }

      if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION) {
        return rootHash === message.body.content.attestation.claimHash;
      }

      if (message.body.type === MessageBodyType.REJECT_ATTESTATION) {
        return rootHash === message.body.content;
      }

      return false;
    },
    [rootHash]
  );

  return useMessages<ISubmitAttestation | IRequestAttestation | IRejectAttestation>(filter);
}
