import 'dexie-observable';

import Dexie, { Table } from 'dexie';

import { Attestation } from './attestation/Attestation';
import { Message } from './message';
import { RequestForAttestation } from './requestForAttestation';

export class CredentialData extends Dexie {
  message!: Table<Message>;
  requestForAttestation!: Table<RequestForAttestation>;
  attestation!: Table<Attestation>;

  constructor(name: string) {
    super(`credential-db:${name}`);
    this.version(1).stores({
      message:
        '++id, syncId, createdAt, deal, *body, sender, receiver, messageId, receivedAt, inReplyTo, *references',
      requestForAttestation:
        '++id, createAt, messageId, *claim, *claimNonceMap, *claimHashes, *claimerSignature, delegationId, *legitimations, &rootHash',
      attestation: '++id, createAt, messageId, &claimHash, cTypeHash, delegationId, revoked'
    });
  }
}

export function createCredentialDb(name: string) {
  return new CredentialData(name);
}