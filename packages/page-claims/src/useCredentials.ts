import { useContext, useMemo } from 'react';

import { DidsContext } from '@credential/react-dids';
import { useAttestationBatch, useClaimerRequests } from '@credential/react-hooks';

export function useCredentials() {
  const { didUri } = useContext(DidsContext);
  const requests = useClaimerRequests(didUri);
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
