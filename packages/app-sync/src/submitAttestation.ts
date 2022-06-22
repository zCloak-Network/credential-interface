/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CredentialData } from '@credential/app-db';
import { Message, MessageBodyType } from '@credential/app-db/message';
import { RequestForAttestationStatus } from '@credential/app-db/requestForAttestation';

export async function submitAttestation(db: CredentialData, message: Message) {
  if (message.body.type !== MessageBodyType.SUBMIT_ATTESTATION) return;

  const attestation = await db.attestation.get({
    claimHash: message.body.content.attestation.claimHash
  });

  if (attestation) {
    // update attestation if has claimHash
    db.attestation.update(attestation.id!, {
      createAt: message.createdAt,
      messageId: message.messageId!,
      ...message.body.content.attestation
    });
  } else {
    db.attestation.add({
      createAt: message.createdAt,
      messageId: message.messageId!,
      ...message.body.content.attestation
    });
  }

  // set request for attestation status
  await db.requestForAttestation
    .where('rootHash')
    .equals(message.body.content.attestation.claimHash)
    .modify({
      status: RequestForAttestationStatus.SUBMIT
    });
}
