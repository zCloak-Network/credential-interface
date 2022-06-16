import type { IAttestation } from '@kiltprotocol/types';

export interface Attestation extends IAttestation {
  id?: number;
  messageCreateAt: number;
  messageId: number;
}
