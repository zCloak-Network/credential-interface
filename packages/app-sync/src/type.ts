import type { DidResourceUri } from '@kiltprotocol/sdk-js';

interface MessageType {
  id: number;
  ciphertext: string;
  nonce: string;
  senderKeyId: string;
  receiverKeyId: string;
}

export interface IDataSource {
  getMessage(id: number, uri?: DidResourceUri, length?: number): Promise<MessageType[]>;
}
