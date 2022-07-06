import 'dexie-observable';

import Dexie, { Table } from 'dexie';

import { Message } from './message';

export class CredentialData extends Dexie {
  message!: Table<Message>;
  attestation: unknown;
  // requestForAttestation!: Table<RequestForAttestation>;
  // attestation!: Table<Attestation>;

  constructor() {
    super('credential-db');
    this.version(1).stores({
      message:
        '++id, syncId, createdAt, deal, *body, sender, receiver, messageId, receivedAt, inReplyTo, *references'
      // requestForAttestation:
      //   '++id, createdAt, messageId, *claim, *claimNonceMap, *claimHashes, *claimerSignature, delegationId, *legitimations, &rootHash',
      // attestation: '++id, createdAt, messageId, &claimHash, cTypeHash, delegationId, revoked'
    });
  }
}

export const credentialDb = new CredentialData();
