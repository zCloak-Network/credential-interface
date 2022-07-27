import 'dexie-observable';

import Dexie, { Table } from 'dexie';

import { CType } from './ctype';
import { Message } from './message';

export class CredentialData extends Dexie {
  ctype!: Table<CType>;
  messages!: Table<Message>;
  message!: Table<Message>;

  constructor(name: string) {
    super(`credential-db${name}`);
    this.version(7).stores({
      ctype: '&hash, owner, *schema',
      messages:
        '&messageId, syncId, isRead, createdAt, deal, *body, sender, receiver, receivedAt, inReplyTo, *references',
      message:
        '++id, syncId, isRead, createdAt, deal, *body, sender, receiver, messageId, receivedAt, inReplyTo, *references'
    });
  }

  public async readMessage(messageId?: string) {
    if (messageId) {
      await this.messages.where('messageId').equals(messageId).modify({
        isRead: 1
      });
    }
  }
}
