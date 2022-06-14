import { CredentialData } from '@credential/app-db';

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

    if (lastOne && lastOne.syncId) {
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
      const iMessages = await Promise.all(data.map((d) => this.parse(d)));

      await this.db.message.bulkAdd(
        iMessages.map((iMessage, index) => ({
          ...iMessage,
          syncId: data[index].id
        }))
      );

      await this.sync();
    }
  }
}
