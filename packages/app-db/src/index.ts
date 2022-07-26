import 'dexie-observable';

import Dexie, { Table } from 'dexie';

import { CType } from './ctype';
import { Message } from './message';

export class CredentialData extends Dexie {
  ctype!: Table<CType>;
  message!: Table<Message>;
  // request!: Table<Request>;
  // attestation!: Table<Attestation>;

  constructor(name: string) {
    super(`credential-db${name}`);
    this.version(2).stores({
      ctype: 'hash, owner, *schema',
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
