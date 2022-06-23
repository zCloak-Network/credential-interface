import type {
  IAttestation,
  IMessage,
  IRejectAttestation,
  IRequestAttestation,
  ISubmitAttestation
} from '@kiltprotocol/types';

import { MessageBodyType } from '@kiltprotocol/types';

type MessageBody = IMessage['body'];

export {
  MessageBodyType,
  IMessage,
  MessageBody,
  IRequestAttestation,
  ISubmitAttestation,
  IRejectAttestation,
  IAttestation
};

export interface Message extends IMessage {
  id?: number;
  syncId?: number;
  deal: 0 | 1;
}
