/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Did, IEncryptedMessage, Message, NaclBoxCapable } from '@kiltprotocol/sdk-js';

import { CredentialData } from '@credential/app-db';

import { IDataSource } from './type';

export class MessageSync {
  private originId?: number;
  private encryptMessages: Map<number, IEncryptedMessage> = new Map();

  public dataSource: IDataSource;
  public db: CredentialData;

  constructor(dataSource: IDataSource, db: CredentialData) {
    this.dataSource = dataSource;
    this.db = db;
  }

  public async syncMessage(didDetails: Did.DidDetails, batch = 2048) {
    if (!didDetails.encryptionKey) return;

    const keyUri = didDetails.assembleKeyUri(didDetails.encryptionKey.id);

    if (this.originId === undefined) {
      const lastOne = await this.db.message
        .orderBy('syncId')
        .reverse()
        .filter((data) => {
          return didDetails.uri === data.receiver;
        })
        .first();

      if (lastOne && lastOne.syncId) {
        this.originId = lastOne.syncId;
      } else {
        this.originId = 0;
      }
    }

    const messageData = await this.dataSource.getMessage(this.originId, keyUri, batch);

    if (messageData.length > 0) {
      messageData.forEach((message) => {
        this.encryptMessages.set(message.id, {
          receiverKeyUri: message.receiverKeyId as any,
          senderKeyUri: message.senderKeyId as any,
          nonce: message.nonce,
          ciphertext: message.ciphertext
        });
      });

      this.originId = messageData[messageData.length - 1].id;

      if (messageData.length >= batch) {
        await this.syncMessage(didDetails, batch);
      }
    }
  }

  public getEncryptMessages(receiverDetails: Did.DidDetails): IEncryptedMessage[] {
    if (!receiverDetails.encryptionKey) return [];

    const messages: IEncryptedMessage[] = [];

    for (const encrypted of this.encryptMessages.values()) {
      if (
        encrypted.receiverKeyUri ===
        receiverDetails.assembleKeyUri(receiverDetails.encryptionKey.id)
      ) {
        messages.push(encrypted);
      }
    }

    return messages;
  }

  public async parse(keystore: Pick<NaclBoxCapable, 'decrypt'>, receiverDetails: Did.DidDetails) {
    const promises: Promise<void>[] = [];

    for (const [key, encrypted] of this.encryptMessages) {
      if (
        receiverDetails.encryptionKey &&
        encrypted.receiverKeyUri ===
          receiverDetails.assembleKeyUri(receiverDetails.encryptionKey.id)
      ) {
        promises.push(
          Message.decrypt(encrypted, keystore, receiverDetails).then(async (message) => {
            await this.db.message.add({
              ...message,
              syncId: key,
              deal: 0
            });
            this.encryptMessages.delete(key);
          })
        );
      }
    }

    await Promise.all(promises);
  }
}
