import { IAttestation, IRequestForAttestation } from '@kiltprotocol/sdk-js';

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

export interface Attestation extends IAttestation {
  messageId?: string;
  createdAt: number;
  receivedAt?: number;
  isRead: boolean;
}
