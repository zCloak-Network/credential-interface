import type { Attestation } from './types';

import { MessageBodyType } from '@kiltprotocol/sdk-js';
import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';

import { CredentialData } from '@credential/app-db';

import { useDebounce } from '.';

export function useAttestation(db: CredentialData, claimHash?: string): Attestation | undefined {
  const getAttestation = useCallback(async () => {
    if (!claimHash) return undefined;

    const message = await db.message
      .orderBy('createdAt')
      .reverse()
      .filter(
        (message) =>
          message.body.type === MessageBodyType.SUBMIT_ATTESTATION &&
          message.body.content.attestation.claimHash === claimHash
      )
      .first();

    if (message && message.body.type === MessageBodyType.SUBMIT_ATTESTATION) {
      return {
        ...message.body.content.attestation,
        messageId: message.messageId,
        createdAt: message.createdAt,
        receivedAt: message.receivedAt,
        isRead: !!message.isRead
      };
    }

    return undefined;
  }, [claimHash, db.message]);

  const data = useLiveQuery(async () => {
    return getAttestation();
  }, [getAttestation]);

  return useDebounce(data, 100);
}
