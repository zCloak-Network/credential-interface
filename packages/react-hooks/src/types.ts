import type { DidUri, IRequestForAttestation } from '@kiltprotocol/sdk-js';

export enum RequestStatus {
  INIT = 'init',
  SUBMIT = 'submit',
  REJECT = 'reject'
}

export interface Request extends IRequestForAttestation {
  messageId?: string;
  status: RequestStatus;
  createdAt: number;
  receivedAt?: number;
  isRead: boolean;
}

export type RequestFilter = {
  receiver?: DidUri;
  owner?: DidUri;
};
