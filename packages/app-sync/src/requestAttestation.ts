/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CredentialData } from '@credential/app-db';
import { Message, MessageBodyType } from '@credential/app-db/message';
import { RequestForAttestationStatus } from '@credential/app-db/requestForAttestation';

export async function requestAttestation(db: CredentialData, message: Message) {
  if (message.body.type !== MessageBodyType.REQUEST_ATTESTATION) return;

  await db.requestForAttestation.add({
    createdAt: message.createdAt,
    messageId: message.messageId!,
    status: RequestForAttestationStatus.INIT,
    ...message.body.content.requestForAttestation
  });
}
