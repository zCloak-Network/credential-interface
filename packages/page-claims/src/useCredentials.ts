import { useMemo } from 'react';

import { useDerivedDid } from '@credential/react-dids';
import { useAttestationBatch, useClaimerRequests } from '@credential/react-hooks';

export function useCredentialsFromMessage() {
  const did = useDerivedDid();
  const requests = useClaimerRequests(did?.uri);
  const claimHashs = useMemo(
    () =>
      requests
        ? requests.map((request) => request.body.content.requestForAttestation.rootHash)
        : [],
    [requests]
  );
  const attestations = useAttestationBatch(claimHashs);

  return useMemo(
    () =>
      requests.length === attestations.length
        ? requests.map((request, index) => ({ request, attestation: attestations[index] }))
        : [],
    [attestations, requests]
  );
}
