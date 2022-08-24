import type { Hash, MessageBody } from '@kiltprotocol/sdk-js';
import type { CType } from './ctype';
import type { Message } from './message';

export interface CredentialQuery {
  messages: {
    all: (filter?: (message: Message<MessageBody>) => boolean) => Promise<Message<MessageBody>[]>;
    lastSync: () => Promise<Message<MessageBody> | undefined>;
  };
  ctypes: {
    all: () => Promise<CType[]>;
  };
}

export interface CredentialWrite {
  messages: {
    read: (messageId?: string) => Promise<void>;
    put: (message: Message<MessageBody>) => Promise<void>;
    batchPut: (messages: Message<MessageBody>[]) => Promise<void>;
  };
  ctypes: {
    put: (ctype: CType) => Promise<void>;
    batchPut: (ctypes: CType[]) => Promise<void>;
    delete: (hash: Hash) => Promise<void>;
  };
}

export interface CredentialInterface {
  query: CredentialQuery;
  write: CredentialWrite;
}
