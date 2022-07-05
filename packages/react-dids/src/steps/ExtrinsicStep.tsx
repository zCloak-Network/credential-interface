import { BlockchainUtils, SubmittableExtrinsic } from '@kiltprotocol/sdk-js';
import { Button, Stack } from '@mui/material';
import { assert } from '@polkadot/util';
import React, { useCallback, useState } from 'react';

import { useKeystore } from '@credential/react-keystore';

import { DidsStepProps } from './types';

interface Props extends DidsStepProps {
  sender?: string | Uint8Array | null;
  getExtrinsic?: () => Promise<SubmittableExtrinsic | null>;
}

const ExtrinsicStep: React.FC<Props> = ({
  getExtrinsic,
  isFirst,
  nextStep,
  prevStep,
  reportError,
  reportStatus,
  sender
}) => {
  const { keyring } = useKeystore();
  const [disabled, setDisabled] = useState(false);

  const handleNext = useCallback(async () => {
    if (!getExtrinsic) return;

    try {
      reportStatus(undefined, true);
      setDisabled(true);

      assert(sender, 'No sender publicKey or address provided');

      const extrinsic = await getExtrinsic();

      if (!extrinsic) return;

      await BlockchainUtils.signAndSubmitTx(extrinsic, keyring.getPair(sender), {
        reSign: false,
        rejectOn: (result) => {
          return result.isError || result.internalError;
        },
        resolveOn: (result) => {
          reportStatus(result.status.type, true);

          return result.isFinalized;
        }
      });
      nextStep();
    } catch (error) {
      reportError(error as Error);
    } finally {
      reportStatus(undefined, false);
      setDisabled(false);
    }
  }, [getExtrinsic, keyring, nextStep, reportError, reportStatus, sender]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <Button disabled={disabled} onClick={handleNext} variant="contained">
          Sign and submit
        </Button>
        {!isFirst && <Button onClick={prevStep}>Back</Button>}
      </Stack>
    </Stack>
  );
};

export default React.memo(ExtrinsicStep);
