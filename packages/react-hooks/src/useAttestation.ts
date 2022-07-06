import { Attestation, Hash } from '@kiltprotocol/sdk-js';
import { useEffect, useState } from 'react';

export function useAttestation(claimHash?: Hash): Attestation | null {
  const [attestation, setAttestation] = useState<Attestation | null>(null);

  useEffect(() => {
    if (claimHash) {
      Attestation.query(claimHash).then(setAttestation);
    }
  }, [claimHash]);

  return attestation;
}

export function useAttestationBatch(claimHashs: Hash[]): (Attestation | null)[] {
  const [attestations, setAttestations] = useState<(Attestation | null)[]>([]);

  useEffect(() => {
    Promise.all(claimHashs.map((claimHash) => Attestation.query(claimHash))).then(setAttestations);
  }, [claimHashs]);

  return attestations;
}
