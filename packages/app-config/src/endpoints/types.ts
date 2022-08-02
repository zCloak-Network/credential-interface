import type { CredentialData } from '@credential/app-db';

export interface Endpoint {
  endpoint: string;
  service: string;
  messageWs: string;
  db: CredentialData;
  faucetLink?: string;
}
