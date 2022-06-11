import type { ICredential } from '@kiltprotocol/sdk-js';

export interface CredentialType {
  credential: ICredential;
  verified: boolean;
  revoked: boolean;
  hash: string;
  timestamp: number;
}

export interface VerifiedCredentialType extends CredentialType {
  verified: true;
}
