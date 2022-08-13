import 'dexie-observable';

import { MessageBody } from '@kiltprotocol/sdk-js';
import Dexie, { Table } from 'dexie';

import { CType } from './ctype';
import { Message } from './message';

export class DexieData extends Dexie {
  public ctype!: Table<CType>;
  public messages!: Table<Message<MessageBody>>;

  constructor(name: string) {
    super(`credential-db-${name}`);
    this.version(1).stores({
      ctype: '&hash, owner, *schema, description',
      messages:
        '&messageId, syncId, isRead, createdAt, *body, sender, receiver, receivedAt, inReplyTo, *references'
    });
  }
}
