import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';

import { CredentialData } from '@credential/app-db';
import { MessageBodyType } from '@credential/app-db/message';

import { useDebounce } from '.';

export function useMessage(db: CredentialData, messageId: string) {
  const data = useLiveQuery(
    () =>
      db.message.get({
        messageId
      }),
    [messageId]
  );

  return useDebounce(data, 300);
}

export function useRequestMessages(db: CredentialData, rootHash: string) {
  const getRequestMessages = useCallback(async () => {
    const messages = db.message
      .filter((message) => {
        console.log(message, rootHash);

        if (message.body.type === MessageBodyType.REQUEST_ATTESTATION) {
          return message.body.content.requestForAttestation.rootHash === rootHash;
        }

        if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION) {
          return message.body.content.attestation.claimHash === rootHash;
        }

        if (message.body.type === MessageBodyType.REJECT_ATTESTATION) {
          return message.body.content === rootHash;
        }

        return false;
      })
      .toArray();

    return messages;
  }, [db.message, rootHash]);

  const data = useLiveQuery(() => getRequestMessages(), [getRequestMessages]);

  return useDebounce(data, 300);
}
