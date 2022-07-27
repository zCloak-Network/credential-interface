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
    this.version(6)
      .upgrade((tx) => {
        tx.table('message')
          .toCollection()
          .toArray()
          .then((messages) => {
            tx.table('messages').bulkPut(
              messages.map((message) => ({
                messageId: message.messageId,
                syncId: message.sync,
                isRead: message.isRead,
                createdAt: message.createdAt,
                deal: message.deal,
                body: message.body,
                sender: message.sender,
                receiver: message.receiver,
                receivedAt: message.receivedAt,
                inReplyTo: message.inReplyTo,
                references: message.references
              })),
              ['messageId']
            );
          });
      })
      .stores({
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
