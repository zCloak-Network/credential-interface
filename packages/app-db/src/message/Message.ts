import { IMessage, MessageBody, MessageBodyType } from '@kiltprotocol/types';

export { IMessage, MessageBody, MessageBodyType };

export interface Message extends IMessage {
  id?: number;
  syncId?: number;
}
