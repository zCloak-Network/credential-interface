import { Hash, MessageBody } from '@kiltprotocol/sdk-js';

import { CType } from './ctype';
import { DexieData } from './DexieData';
import { Message } from './message';
import { CredentialInterface, CredentialQuery, CredentialWrite } from './types';

function generateQuery(data: DexieData): CredentialQuery {
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
    }
  };
}

function generateWrite(data: DexieData): CredentialWrite {
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
    }
  };
}

export class CredentialFetcher implements CredentialInterface {
  #query: CredentialQuery;
  #write: CredentialWrite;

  constructor(name: string) {
    const data = new DexieData(name);

    this.#query = generateQuery(data);
    this.#write = generateWrite(data);
  }

  public get query(): CredentialQuery {
    return this.#query;
  }

  public get write(): CredentialWrite {
    return this.#write;
  }
}
