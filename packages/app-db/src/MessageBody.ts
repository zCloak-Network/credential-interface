import type { MessageBody as IMessageBody } from '@kiltprotocol/types';

export { IMessageBody };

export interface MessageBody {
  id?: number;
  body: IMessageBody;
  messageId: number;
}
