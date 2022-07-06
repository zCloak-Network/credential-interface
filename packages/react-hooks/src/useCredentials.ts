import type { DidUri, ISubmitAttestation } from '@kiltprotocol/types';
import type { Attestation, Request } from './types';

import { MessageBodyType } from '@kiltprotocol/sdk-js';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';

import { CredentialData } from '@credential/app-db';

import { useRequestForAttestation } from './useRequestForAttestation';
import { useDebounce } from '.';

export function useCredentials(db: CredentialData, owner?: DidUri) {
  const requests = useRequestForAttestation(db, owner);

  const getCredential = useCallback(async () => {
    if (!requests) return [];

    const messages = await Promise.all(
      requests.map((request) =>
        db.message
          .orderBy('createdAt')
          .reverse()
          .filter(
            (message) =>
              message.body.type === MessageBodyType.SUBMIT_ATTESTATION &&
              message.body.content.attestation.claimHash === request.rootHash
          )
          .first()
      )
    );

    const credentials: { attestation?: Attestation; request: Request }[] = messages.map(
      (message, index) => ({
        request: requests[index],
        attestation: message
          ? {
              ...(message.body as ISubmitAttestation).content.attestation,
              messageId: message.messageId,
              createdAt: message.createdAt,
              receivedAt: message.receivedAt,
              isRead: !!message.isRead
            }
          : undefined
      })
    );

    return credentials;
  }, [db.message, requests]);

  const data = useLiveQuery(async () => {
    return getCredential();
  }, [getCredential]);

  return useDebounce(data, 100);
}
