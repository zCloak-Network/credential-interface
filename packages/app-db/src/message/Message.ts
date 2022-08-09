import type { IMessage } from '@kiltprotocol/types';

import { MessageBody } from '@kiltprotocol/types';

export interface Message<Body extends MessageBody> extends IMessage {
  body: Body;
  syncId?: number;
  isRead?: 0 | 1;
}
