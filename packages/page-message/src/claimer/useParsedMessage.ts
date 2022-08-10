import type {
  Hash,
  ICredential,
  IRejectAttestation,
  IRequestAttestation,
  ISubmitAttestation,
  ISubmitCredential
} from '@kiltprotocol/types';

import { MessageBodyType } from '@kiltprotocol/types';
import { useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { useCredential, useRequestStatus } from '@credential/react-hooks';
import { RequestStatus } from '@credential/react-hooks/types';

export type UseParsedMessage = {
  ctypeHash?: Hash | null;
  rootHash: Hash;
  credential?: ICredential | null;
  status: RequestStatus;
};

export function useParsedMessage(
  message: Message<
    ISubmitAttestation | IRejectAttestation | IRequestAttestation | ISubmitCredential
  >
): UseParsedMessage {
  const rootHash = useMemo((): Hash => {
    return message.body.type === MessageBodyType.SUBMIT_ATTESTATION
      ? message.body.content.attestation.claimHash
      : message.body.type === MessageBodyType.REQUEST_ATTESTATION
      ? message.body.content.requestForAttestation.rootHash
      : message.body.type === MessageBodyType.REJECT_ATTESTATION
      ? message.body.content
      : message.body.content[0].request.rootHash;
  }, [message.body.content, message.body.type]);

  const ctypeHash = useMemo((): Hash | null => {
    return message.body.type === MessageBodyType.SUBMIT_ATTESTATION
      ? message.body.content.attestation.cTypeHash
      : message.body.type === MessageBodyType.REQUEST_ATTESTATION
      ? message.body.content.requestForAttestation.claim.cTypeHash
      : message.body.type === MessageBodyType.REJECT_ATTESTATION
      ? null
      : message.body.content[0].attestation.cTypeHash;
  }, [message.body.content, message.body.type]);

  const credential = useMemo(() => {
    return message.body.type === MessageBodyType.SUBMIT_CREDENTIAL ? message.body.content[0] : null;
  }, [message.body.content, message.body.type]);
  const localCredential = useCredential(rootHash);
  const status = useRequestStatus(rootHash);

  return useMemo(
    () => ({
      rootHash,
      ctypeHash:
        ctypeHash ||
        credential?.request.claim.cTypeHash ||
        localCredential?.request.claim.cTypeHash,
      status,
      credential: credential || localCredential
    }),
    [credential, ctypeHash, localCredential, rootHash, status]
  );
}
