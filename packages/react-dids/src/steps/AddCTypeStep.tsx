import { CType, DidUri } from '@kiltprotocol/sdk-js';
import { Button, Stack } from '@mui/material';
import { assert } from '@polkadot/util';
import React, { useCallback, useEffect, useState } from 'react';

import { credentialApi } from '@credential/react-hooks/api';

import { DidsStepProps } from './types';

interface Props extends DidsStepProps {
  ctype?: CType | null;
  sender?: DidUri | null;
}

const AddCTypeStep: React.FC<Props> = ({
  ctype,
  execFunc,
  isFirst,
  nextStep,
  prevStep,
  reportError,
  reportStatus,
  sender,
  step
}) => {
  const [disabled, setDisabled] = useState(false);

  const handleNext = useCallback(async () => {
    try {
      reportStatus(undefined, true);
      setDisabled(true);

      assert(ctype, 'No ctype found');
      assert(sender, 'No sender found');

      await credentialApi.addCType({
        owner: sender,
        ctypeHash: ctype.hash,
        metadata: ctype.schema
      });
      nextStep();
    } catch (error) {
      reportError(error as Error);
    } finally {
      reportStatus(undefined, false);
      setDisabled(false);
    }
  }, [ctype, nextStep, reportError, reportStatus, sender]);

  useEffect(() => {
    execFunc(step, handleNext);
  }, [execFunc, handleNext, step]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <Button disabled={disabled} onClick={handleNext} variant="contained">
          Send
        </Button>
        {!isFirst && <Button onClick={prevStep}>Back</Button>}
      </Stack>
    </Stack>
  );
};

export default React.memo(AddCTypeStep);
