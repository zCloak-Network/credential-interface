import type { Hash } from '@kiltprotocol/types';

import { Attestation } from '@kiltprotocol/sdk-js';
import { useMemo } from 'react';

import { CredentialData } from '@credential/app-db';

import { Request, RequestFilter, RequestStatus } from './types';
import { useAttestation, useAttestationBatch } from './useAttestation';
import { useRequest, useRequestForAttestation } from './useRequestForAttestation';

export function useCredentials(
  db: CredentialData,
  filter: RequestFilter
): { request: Request; attestation: Attestation | null | undefined }[] {
  const requests = useRequestForAttestation(db, filter);

  const claimHashs = useMemo(() => (requests ?? []).map((request) => request.rootHash), [requests]);
  const attestations = useAttestationBatch(claimHashs);

  return useMemo(() => {
    if (requests && attestations && requests.length === attestations.length) {
      return requests.map((request, index) => ({
        request: {
          ...request,
          status: attestations[index] ? RequestStatus.SUBMIT : request.status
        },
        attestation: attestations[index]
      }));
    } else {
      return [];
    }
  }, [attestations, requests]);
}

export function useCredential(
  db: CredentialData,
  rootHash?: Hash
): { request?: Request; attestation: Attestation | null | undefined } {
  const request = useRequest(db, rootHash);
  const attestation = useAttestation(rootHash);

  return {
    request: request
      ? {
          ...request,
          status: attestation ? RequestStatus.SUBMIT : request.status
        }
      : request,
    attestation
  };
}
