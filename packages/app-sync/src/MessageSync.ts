import { CredentialData } from '@credential/app-db';
import { Message } from '@credential/app-db/Message';

import { IDataSource, ParserFunc } from './type';

export class MessageSync {
  public dataSource: IDataSource;
  public db: CredentialData;
  public receiverKeyId: string;
  public batch?: number;
  public parse: ParserFunc;

  constructor(
    dataSource: IDataSource,
    parse: ParserFunc,
    db: CredentialData,
    receiverKeyId: string,
    batch = 2048
  ) {
    this.dataSource = dataSource;
    this.parse = parse;
    this.db = db;
    this.receiverKeyId = receiverKeyId;
    this.batch = batch;
  }

  public async sync(): Promise<void> {
    const lastOne = await this.db.message.orderBy('syncId').first();

    let originId: number;

    if (lastOne) {
      originId = lastOne.syncId + 1;
    } else {
      originId = 0;
    }

    const data = await this.dataSource.getMessage(
      originId,
      undefined,
      this.receiverKeyId,
      this.batch
    );

    if (data.length > 0) {
      await this.db.message.bulkAdd(
        data.map(({ ciphertext, id, nonce, receiverKeyId, senderKeyId }) => ({
          ciphertext,
          nonce,
          senderKeyId,
          receiverKeyId,
          syncId: id
        }))
      );
      await this.sync();
    }
  }

  public async parseMessage(): Promise<void> {
    const lastOne = await this.db.messageBody.orderBy('messageId').first();

    let messages: Message[];

    if (lastOne) {
      messages = await this.db.message.where('id').above(lastOne.messageId).toArray();
    } else {
      messages = await this.db.message.toArray();
    }

    const bodys = await Promise.all(messages.map((message) => this.parse(message)));

    await this.db.messageBody.bulkAdd(
      messages.map((message, index) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        messageId: message.id!,
        body: bodys[index]
      }))
    );
  }
}
