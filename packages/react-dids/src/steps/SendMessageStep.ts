import type { CredentialInterface } from '@credential/app-db/types';

import { IEncryptedMessage, MessageBody } from '@kiltprotocol/sdk-js';
import { assert } from '@polkadot/util';

import { Message } from '@credential/app-db/message';
import { credentialApi } from '@credential/react-hooks/api';

export async function sendMessage(
  fetcher?: CredentialInterface | null,
  encryptedMessage?: IEncryptedMessage | null,
  reCaptchaToken?: string | null,
  saveMessage?: Message<MessageBody> | null
): Promise<void> {
  assert(fetcher, 'No credential fetcher provided');
  assert(encryptedMessage, 'Not encrypted message found');
  assert(reCaptchaToken, 'No recaptcha token provided');
  assert(saveMessage, 'No save message found');

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

  fetcher.write.messages.put({ ...saveMessage, isRead: 1 });
}
