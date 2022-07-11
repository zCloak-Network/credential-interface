import { IEncryptedMessage } from '@kiltprotocol/sdk-js';
import { assert } from '@polkadot/util';

import { credentialApi } from '@credential/react-hooks/api';

export async function sendMessage(
  encryptedMessage?: IEncryptedMessage,
  reCaptchaToken?: string
): Promise<void> {
  assert(encryptedMessage, 'Not encrypted message found');
  assert(reCaptchaToken, 'No recaptcha token provided');

  const { code, message } = await credentialApi.addMessage({
    receiverKeyId: encryptedMessage.receiverKeyUri,
    senderKeyId: encryptedMessage.senderKeyUri,
    nonce: encryptedMessage.nonce,
    ciphertext: encryptedMessage.ciphertext,
    reCaptchaToken
  });

  if (code !== 200) {
    throw new Error(message ?? 'Server error');
  }
}
