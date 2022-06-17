import type { IRequestForAttestation } from '@kiltprotocol/types';

export enum RequestForAttestationStatus {
  INIT = 'init',
  SUBMIT = 'submit',
  REJECT = 'reject'
}

export interface RequestForAttestation extends IRequestForAttestation {
  id?: number;
  messageCreateAt: number;
  messageId: string;
  status: RequestForAttestationStatus;
}
