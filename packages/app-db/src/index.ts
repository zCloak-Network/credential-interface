import Dexie, { Table } from 'dexie';

import { Message } from './message';

export class CredentialData extends Dexie {
  message!: Table<Message>;

  constructor() {
    super('credential-db');
    this.version(1).stores({
      message:
        '++id, syncId, *body, sender, receiver, messageId, receivedAt, inReplyTo, *references'
    });
  }
}

export const credentialDb = new CredentialData();
