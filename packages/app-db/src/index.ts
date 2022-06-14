import Dexie, { Table } from 'dexie';

import { Message } from './Message';
import { MessageBody } from './MessageBody';

export class CredentialData extends Dexie {
  message!: Table<Message>;
  messageBody!: Table<MessageBody>;

  constructor() {
    super('credential-db');
    this.version(1).stores({
      message: '++id, ciphertext, nonce, senderKeyId, receiverKeyId, syncId',
      messageBody: '++id, *body, messageId'
    });
  }
}

export const credentialDb = new CredentialData();
