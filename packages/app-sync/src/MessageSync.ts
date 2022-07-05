/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  Did,
  DidResourceUri,
  IEncryptedMessage,
  Message,
  NaclBoxCapable
} from '@kiltprotocol/sdk-js';

import { CredentialData } from '@credential/app-db';
import { Message as MessageDb, MessageBodyType } from '@credential/app-db/message';

import { rejectAttestation } from './rejectAttestation';
import { requestAttestation } from './requestAttestation';
import { submitAttestation } from './submitAttestation';
import { IDataSource } from './type';

export class MessageSync {
  public dataSource: IDataSource;
  public db: CredentialData;
  public keyUri: DidResourceUri;
  public batch: number;

  public encryptMessages: (IEncryptedMessage & { syncId: number })[] = [];

  constructor(dataSource: IDataSource, db: CredentialData, keyUri: DidResourceUri, batch = 2048) {
    this.dataSource = dataSource;
    this.db = db;
    this.keyUri = keyUri;
    this.batch = batch;
  }

  public async syncMessage() {
    const lastOne = await this.db.message
      .orderBy('syncId')
      .reverse()
      .filter((data) => {
        return data.receiver === this.keyUri;
      })
      .first();

    let originId: number;

    if (lastOne && lastOne.syncId) {
      originId = lastOne.syncId;
    } else {
      originId = 0;
    }

    const messageData = await this.dataSource.getMessage(originId, this.keyUri, this.batch);

    if (messageData.length > 0) {
      this.encryptMessages.push(
        ...messageData.map((message) => ({
          syncId: message.id,
          receiverKeyUri: message.receiverKeyId as any,
          senderKeyUri: message.senderKeyId as any,
          nonce: message.nonce,
          ciphertext: message.ciphertext
        }))
      );

      if (messageData.length >= this.batch) {
        await this.syncMessage();
      }
    }
  }

  public async parse(keystore: Pick<NaclBoxCapable, 'decrypt'>, receiverDetails: Did.DidDetails) {
    const messages: MessageDb[] = [];

    while (this.encryptMessages.length > 0) {
      const encrypted = this.encryptMessages.shift();

      if (!encrypted) {
        break;
      }

      const message = await Message.decrypt(encrypted, keystore, receiverDetails);

      messages.push({
        ...message,
        syncId: encrypted.syncId,
        deal: 0
      });
    }

    await this.db.message.bulkAdd(messages);

    await this.parseMessageBody();
  }

  private async parseMessageBody(): Promise<void> {
    const messages = await this.db.message.where('deal').equals(0).sortBy('createdAt');

    for (const message of messages) {
      await this.db.transaction(
        'rw',
        this.db.message,
        this.db.attestation,
        this.db.requestForAttestation,
        async () => {
          let deal = 0;

          switch (message.body.type) {
            case MessageBodyType.REQUEST_ATTESTATION:
              await requestAttestation(this.db, message);
              deal = 1;

              break;

            case MessageBodyType.SUBMIT_ATTESTATION:
              submitAttestation(this.db, message);
              deal = 1;

              break;

            case MessageBodyType.REJECT_ATTESTATION:
              await rejectAttestation(this.db, message);
              deal = 1;

              break;

            default:
              deal = 0;
              break;
          }

          this.db.message.update(message.id!, { deal });
        }
      );
    }
  }
}
