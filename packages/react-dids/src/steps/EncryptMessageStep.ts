import { Did, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { assert } from '@polkadot/util';

import { Keyring } from '@credential/react-keystore/Keyring';

export async function encryptMessage(
  keyring: Keyring,
  message?: Message | null,
  sender?: Did.DidDetails | null,
  receiver?: Did.DidDetails | null
): Promise<IEncryptedMessage> {
  assert(sender, 'No sender did provided');
  assert(sender.encryptionKey, "Sender has't encryptionKey");
  assert(receiver, 'No receiver did provided');
  assert(receiver.encryptionKey, "Receiver has't encryptionKey");
  assert(message, 'Message not provided');

  const encrypted = await message.encrypt(
    sender.encryptionKey.id,
    sender,
    keyring,
    receiver.assembleKeyUri(receiver.encryptionKey.id)
  );

  return encrypted;
}
