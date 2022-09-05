import type { Hash, MessageBody } from '@kiltprotocol/sdk-js';
import type { Credential } from './credential';
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
  credential: {
    all: (filter?: (credential: Credential) => boolean) => Promise<Credential[]>;
    one: (rootHash: Hash) => Promise<Credential | undefined>;
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
  credential: {
    put: (credential: Credential) => Promise<void>;
    batchPut: (credentials: Credential[]) => Promise<void>;
    delete: (rootHash: Hash) => Promise<void>;
  };
}

export interface CredentialInterface {
  query: CredentialQuery;
  write: CredentialWrite;
}
