import { Did } from '@kiltprotocol/sdk-js';
import { Button, Stack } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import InputDid from '../InputDid';
import { DidsStepProps } from './types';

interface Props extends DidsStepProps {
  onChange: (fullDid: Did.FullDidDetails | null) => void;
}

const InputDidStep: React.FC<Props> = ({
  execFunc,
  isFirst,
  nextStep,
  onChange,
  prevStep,
  reportError,
  step
}) => {
  const [fullDid, setFullDid] = useState<Did.FullDidDetails | null>(null);

  const handleNext = useCallback(() => {
    if (fullDid) {
      reportError(null);
      onChange(fullDid);
      nextStep();
    } else {
      reportError(new Error("Can't found full did on chain, please make sure it is trusted"));
    }
  }, [fullDid, nextStep, onChange, reportError]);

  useEffect(() => {
    execFunc(step, handleNext);
  }, [execFunc, handleNext, step]);

  return (
    <Stack spacing={3}>
      <InputDid onChange={setFullDid} />
      <Stack direction="row" spacing={2}>
        <Button disabled={!fullDid} onClick={handleNext} variant="contained">
          Next
        </Button>
        {!isFirst && <Button onClick={prevStep}>Back</Button>}
      </Stack>
    </Stack>
  );
};

export default React.memo(InputDidStep);
