import { IEncryptedMessage } from '@kiltprotocol/sdk-js';
import { assert } from '@polkadot/util';

import { credentialApi } from '@credential/react-hooks/api';

export async function sendMessage(encryptedMessage?: IEncryptedMessage): Promise<void> {
  assert(encryptedMessage, 'Not encrypted message found');

  await credentialApi.addMessage({
    receiverKeyId: encryptedMessage.receiverKeyUri,
    senderKeyId: encryptedMessage.senderKeyUri,
    nonce: encryptedMessage.nonce,
    ciphertext: encryptedMessage.ciphertext
  });
}
