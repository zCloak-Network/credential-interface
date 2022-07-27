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
    this.version(3)
      .stores({
        ctype: '&hash, owner, *schema',
        message:
          '&syncId, isRead, createdAt, deal, *body, sender, receiver, &messageId, receivedAt, inReplyTo, *references'
      })
      .upgrade((tx) => {
        tx.table('message').delete('id');
        tx.table('message')
          .toCollection()
          .toArray()
          .then((messages) => {
            const set = new Set();
            const set2 = new Set();

            messages.forEach((message) => {
              if (set.has(message.messageId)) {
                set2.add(message.messageId);
              }

              set.add(message.messageId);
            });

            tx.table('message')
              .filter((message) => {
                return !message.syncId && set2.has(message.messageId);
              })
              .delete();
          });
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
