/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CredentialData } from '@credential/app-db';
import { Message, MessageBodyType } from '@credential/app-db/message';

import { rejectAttestation } from './rejectAttestation';
import { requestAttestation } from './requestAttestation';
import { submitAttestation } from './submitAttestation';
import { IDataSource, ParserFunc } from './type';

export class MessageSync {
  public dataSource: IDataSource;
  public db: CredentialData;
  public keyId: string;
  public batch: number;
  public parse: ParserFunc;

  constructor(
    dataSource: IDataSource,
    parse: ParserFunc,
    db: CredentialData,
    keyId: string,
    batch = 2048
  ) {
    this.dataSource = dataSource;
    this.parse = parse;
    this.db = db;
    this.keyId = keyId;
    this.batch = batch;
  }

  public async sync(): Promise<void> {
    await this.syncMessage();
    await this.parseMessageBody();
  }

  private async syncMessage() {
    const lastOne = await this.db.message
      .orderBy('syncId')
      .reverse()
      .filter((data) => {
        return data.receiver === this.keyId;
      })
      .first();

    let originId: number;

    if (lastOne && lastOne.syncId) {
      originId = lastOne.syncId;
    } else {
      originId = 0;
    }

    const messageData = await this.dataSource.getMessage(originId, this.keyId, this.batch);

    if (messageData.length > 0) {
      const messages: Message[] = (
        await Promise.all(messageData.map((data) => this.parse(data)))
      ).map((message, index) => ({
        ...message,
        syncId: messageData[index].id,
        deal: 0
      }));

      await this.db.message.bulkAdd(messages);

      if (messageData.length >= this.batch) {
        await this.sync();
      }
    }
  }

  private async parseMessageBody(): Promise<void> {
    const messages = await this.db.message.where('deal').equals(0).sortBy('messageCreateAt');

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
