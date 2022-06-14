export interface Message {
  id?: number;
  ciphertext: string;
  nonce: string;
  senderKeyId: string;
  receiverKeyId: string;
  syncId: number;
}
