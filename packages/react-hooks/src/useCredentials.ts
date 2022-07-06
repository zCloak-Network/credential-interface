import type { DidUri } from '@kiltprotocol/types';
import type { Request } from './types';

import { Attestation } from '@kiltprotocol/sdk-js';
import { useMemo } from 'react';

import { CredentialData } from '@credential/app-db';

import { useAttestationBatch } from './useAttestation';
import { useRequestForAttestation } from './useRequestForAttestation';

export function useCredentials(
  db: CredentialData,
  owner?: DidUri
): { request: Request; attestation: Attestation | null | undefined }[] {
  const requests = useRequestForAttestation(db, owner);

  const claimHashs = useMemo(() => (requests ?? []).map((request) => request.rootHash), [requests]);
  const attestations = useAttestationBatch(claimHashs);

  return useMemo(() => {
    if (requests && attestations) {
      return requests.map((request, index) => ({
        request,
        attestation: attestations[index]
      }));
    } else {
      return [];
    }
  }, [attestations, requests]);
}
