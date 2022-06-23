import type { IAttestation } from '@kiltprotocol/types';

export interface Attestation extends IAttestation {
  id?: number;
  messageId: string;
  createAt: number;
}
