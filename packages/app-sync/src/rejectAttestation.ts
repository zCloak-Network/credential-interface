/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CredentialData } from '@credential/app-db';
import { Message, MessageBodyType } from '@credential/app-db/message';
import { RequestForAttestationStatus } from '@credential/app-db/requestForAttestation';

export async function rejectAttestation(db: CredentialData, message: Message) {
  if (message.body.type !== MessageBodyType.REJECT_ATTESTATION) return;

  await db.requestForAttestation.where('rootHash').equals(message.body.content).modify({
    createdAt: message.createdAt,
    messageId: message.messageId!,
    status: RequestForAttestationStatus.REJECT
  });
}
