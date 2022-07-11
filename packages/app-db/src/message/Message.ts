import type { IMessage } from '@kiltprotocol/types';

export interface Message extends IMessage {
  id?: number;
  syncId?: number;
  deal: 0 | 1;
  isRead?: 0 | 1;
}
