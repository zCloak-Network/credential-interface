import type { IRequestForAttestation } from '@kiltprotocol/types';

export enum RequestForAttestationStatus {
  INIT = 'init',
  SUBMIT = 'submit',
  REJECT = 'reject'
}

export interface RequestForAttestation extends IRequestForAttestation {
  id?: number;
  createdAt: number;
  messageId: string;
  status: RequestForAttestationStatus;
}
