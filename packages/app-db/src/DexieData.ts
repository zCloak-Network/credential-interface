import 'dexie-observable';

import { Hash, MessageBody } from '@kiltprotocol/sdk-js';
import Dexie, { Table } from 'dexie';

import { Credential } from './credential';
import { CType } from './ctype';
import { Message } from './message';
import { CredentialQuery, CredentialWrite } from './types';

export function generateQuery(data: DexieData): CredentialQuery {
  return {
    messages: {
      all: (filter) =>
        data.messages
          .orderBy('createdAt')
          .reverse()
          .filter((message) => {
            if (filter) return filter(message);

            return true;
          })
          .toArray(),
      lastSync: () =>
        data.messages
          .orderBy('syncId')
          .filter((message) => message.syncId !== undefined && message.syncId !== null)
          .last()
    },
    ctypes: {
      all: () => data.ctype.toArray()
    },
    credential: {
      all: (filter) =>
        data.credential
          .orderBy('updateTime')
          .reverse()
          .filter((credential) => {
            if (filter) return filter(credential);

            return true;
          })
          .toArray(),
      one: (rootHash) => data.credential.where({ rootHash }).first()
    }
  };
}

export function generateWrite(data: DexieData): CredentialWrite {
  return {
    messages: {
      read: async (messageId?: string) => {
        await (messageId &&
          data.messages.where('messageId').equals(messageId).modify({
            isRead: 1
          }));
      },
      put: async (message: Message<MessageBody>) => {
        await data.messages.put(message);
      },
      batchPut: async (messages: Message<MessageBody>[]) => {
        await data.messages.bulkPut(messages);
      }
    },
    ctypes: {
      put: async (ctype: CType) => {
        await data.ctype.put(ctype);
      },
      batchPut: async (ctypes: CType[]) => {
        await data.ctype.bulkPut(ctypes);
      },
      delete: async (hash: Hash) => {
        await data.ctype.delete(hash);
      }
    },
    credential: {
      put: async (credential: Credential) => {
        await data.credential.put(credential);
      },
      batchPut: async (credentials: Credential[]) => {
        await data.credential.bulkPut(credentials);
      },
      delete: async (rootHash: Hash) => {
        await data.credential.delete(rootHash);
      }
    }
  };
}

export class DexieData extends Dexie {
  public ctype!: Table<CType>;
  public messages!: Table<Message<MessageBody>>;
  public credential!: Table<Credential>;

  constructor(name: string) {
    super(`credential-db-${name}`);
    this.version(2).stores({
      ctype: '&hash, owner, *schema, description, type',
      messages:
        '&messageId, syncId, isRead, createdAt, *body, sender, receiver, receivedAt, inReplyTo, *references',
      credential:
        '&rootHash, owner, attester, ctypeHash, updateTime, requestTime, attestedTime, version, source, *request, *credential'
    });
  }
}
