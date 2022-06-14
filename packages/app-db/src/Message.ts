import type { IMessage } from '@kiltprotocol/types';

export { IMessage };

export interface Message extends IMessage {
  id?: number;
  syncId?: number;
}
