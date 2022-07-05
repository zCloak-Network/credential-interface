import { CType, DidUri } from '@kiltprotocol/sdk-js';
import { Button, Stack } from '@mui/material';
import { assert } from '@polkadot/util';
import React, { useCallback } from 'react';

import { credentialApi } from '@credential/react-hooks/api';

import { DidsStepProps } from './types';

interface Props extends DidsStepProps {
  ctype?: CType | null;
  sender?: DidUri | null;
}

const AddCTypeStep: React.FC<Props> = ({
  ctype,
  isFirst,
  nextStep,
  prevStep,
  reportError,
  sender
}) => {
  const handleNext = useCallback(async () => {
    try {
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
    }
  }, [ctype, nextStep, reportError, sender]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <Button onClick={handleNext} variant="contained">
          Send
        </Button>
        {!isFirst && <Button onClick={prevStep}>Back</Button>}
      </Stack>
    </Stack>
  );
};

export default React.memo(AddCTypeStep);
