import 'dexie-observable';

import Dexie, { Table } from 'dexie';

import { Message } from './message';

export class CredentialData extends Dexie {
  message!: Table<Message>;
  // request!: Table<Request>;
  // attestation!: Table<Attestation>;

  constructor() {
    super('credential-db');
    this.version(1).stores({
      message:
        '++id, syncId, isRead, createdAt, deal, *body, sender, receiver, messageId, receivedAt, inReplyTo, *references'
      // request:
      //   '++id, messageId, isRead, *claim, *claimNonceMap, *claimHashes, *claimerSignature, delegationId, *legitimations, &rootHash',
      // attestation:
      //   '++id, updateTime, messageId, &claimHash, cTypeHash, owner, delegationId, revoked'
    });
  }

  public async readMessage(messageId?: string) {
    if (messageId) {
      await this.message.where('messageId').equals(messageId).modify({
        isRead: 1
      });
    }
  }
}

export const credentialDb = new CredentialData();
