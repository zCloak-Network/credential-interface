import type { DidUri, Hash, ICredential } from '@kiltprotocol/types';

export type CredentialVersion = 0;
export type CredentialSource = 'KILT Peregrine' | 'KILT Spiritnet';

export interface Credential extends ICredential {
  owner: DidUri;
  rootHash: Hash;
  attester: DidUri;
  ctypeHash: Hash;
  updateTime: number;
  source: string;
  version: CredentialVersion;
  requestTime?: number;
  attestedTime?: number;
}
