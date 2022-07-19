export interface MessageType {
  id: number;
  ciphertext: string;
  nonce: string;
  senderKeyId: string;
  receiverKeyId: string;
}
