import { Claim, CType, Did, IClaimContents, RequestForAttestation } from '@kiltprotocol/sdk-js';
import { Button, Stack } from '@mui/material';
import { assert } from '@polkadot/util';
import React, { useCallback, useEffect, useState } from 'react';

import { useKeystore } from '@credential/react-keystore';

import { DidsStepProps } from './types';

interface Props extends DidsStepProps {
  sender?: Did.DidDetails | null;
  ctype?: CType | null;
  contents?: IClaimContents;
  handleRequest: (request: RequestForAttestation) => void;
}

const RequestAttestationStep: React.FC<Props> = ({
  contents,
  ctype,
  execFunc,
  handleRequest,
  isFirst,
  nextStep,
  prevStep,
  reportError,
  reportStatus,
  sender,
  step
}) => {
  const { keyring } = useKeystore();
  const [disabled, setDisabled] = useState(false);

  const handleNext = useCallback(async () => {
    try {
      reportStatus(undefined, true);
      setDisabled(true);
      assert(sender, 'No sender did provided');
      assert(ctype, 'No CType found');
      assert(contents, 'Claim contents is empty');

      const claim = Claim.fromCTypeAndClaimContents(ctype, contents, sender.uri);

      const requestForAttestation = await RequestForAttestation.fromClaim(claim).signWithDidKey(
        keyring,
        sender,
        sender.authenticationKey.id
      );

      handleRequest(requestForAttestation);

      nextStep();
    } catch (error) {
      reportError(error as Error);
    } finally {
      reportStatus(undefined, false);
      setDisabled(false);
    }
  }, [contents, ctype, handleRequest, keyring, nextStep, reportError, reportStatus, sender]);

  useEffect(() => {
    execFunc(step, handleNext);
  }, [execFunc, handleNext, step]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <Button disabled={disabled} onClick={handleNext} variant="contained">
          Sign and Request
        </Button>
        {!isFirst && <Button onClick={prevStep}>Back</Button>}
      </Stack>
    </Stack>
  );
};

export default React.memo(RequestAttestationStep);
