import type { DidUri } from '@kiltprotocol/types';

import { IRequestAttestation, MessageBodyType } from '@kiltprotocol/sdk-js';
import { useLiveQuery } from 'dexie-react-hooks';

import { CredentialData } from '@credential/app-db';

import { Request, RequestStatus } from './types';
import { useDebounce } from '.';

async function getStatus(db: CredentialData, rootHash: string): Promise<RequestStatus> {
  const reject = await db.message
    .orderBy('createdAt')
    .reverse()
    .filter(
      (m) => m.body.type === MessageBodyType.REJECT_ATTESTATION && m.body.content === rootHash
    )
    .first();
  const submit = await db.message
    .orderBy('createdAt')
    .reverse()
    .filter(
      (m) =>
        m.body.type === MessageBodyType.SUBMIT_ATTESTATION &&
        m.body.content.attestation.claimHash === rootHash
    )
    .first();

  if (submit && reject) {
    return reject.createdAt > submit.createdAt ? RequestStatus.REJECT : RequestStatus.SUBMIT;
  } else if (submit && !reject) {
    return RequestStatus.SUBMIT;
  } else if (!submit && reject) {
    return RequestStatus.REJECT;
  } else {
    return RequestStatus.INIT;
  }
}

export function useRequestForAttestation(
  db: CredentialData,
  owner?: DidUri
): Request[] | undefined {
  const data = useLiveQuery(async () => {
    const messages = await db.message
      .orderBy('createdAt')
      .reverse()
      .filter(
        (message) =>
          message.body.type === MessageBodyType.REQUEST_ATTESTATION &&
          (!owner ? true : message.body.content.requestForAttestation.claim.owner === owner)
      )
      .toArray();

    const requests: Request[] = [];

    for await (const message of messages) {
      requests.push({
        ...(message.body as IRequestAttestation).content.requestForAttestation,
        messageId: message.messageId,
        createdAt: message.createdAt,
        receivedAt: message.receivedAt,
        status: await getStatus(
          db,
          (message.body as IRequestAttestation).content.requestForAttestation.rootHash
        ),
        isRead: !!message.isRead
      });
    }

    return requests;
  }, [owner]);

  return useDebounce(data, 100);
}

export function useRequest(db: CredentialData, rootHash?: string): Request | undefined {
  const data = useLiveQuery(async () => {
    const message = await db.message
      .orderBy('createdAt')
      .reverse()
      .filter(
        (message) =>
          message.body.type === MessageBodyType.REQUEST_ATTESTATION &&
          message.body.content.requestForAttestation.rootHash === rootHash
      )
      .first();

    if (message && message.body.type === MessageBodyType.REQUEST_ATTESTATION) {
      return {
        ...message.body.content.requestForAttestation,
        messageId: message.messageId,
        createdAt: message.createdAt,
        receivedAt: message.receivedAt,
        status: await getStatus(db, message.body.content.requestForAttestation.rootHash),
        isRead: !!message.isRead
      };
    }

    return undefined;
  }, [rootHash]);

  return useDebounce(data, 100);
}
