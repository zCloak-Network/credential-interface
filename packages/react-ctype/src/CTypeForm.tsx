import type { CType } from '@kiltprotocol/sdk-js';

import { IClaim } from '@kiltprotocol/sdk-js';
import { LoadingButton } from '@mui/lab';
import { Box, FormControl, InputLabel, OutlinedInput, Stack } from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';

import { NotificationContext, useClaimer } from '@credential/react-components';

import CTypeItem from './CTypeItem';

const CTypeForm: React.FC<{ cType: CType; onGenerateClaim?: (claim: IClaim) => void }> = ({
  cType,
  onGenerateClaim
}) => {
  const [data, setData] = useState<Record<string, unknown>>({});
  const { notifyError } = useContext(NotificationContext);
  const { claimer } = useClaimer();

  const onSubmit = useCallback(() => {
    try {
      onGenerateClaim?.(claimer.generateClaim(cType, data as any));
    } catch (error) {
      notifyError(error);
    }
  }, [cType, claimer, data, notifyError, onGenerateClaim]);

  const onChange = useCallback((key: string, value: unknown) => {
    setData((data) => ({
      ...data,
      [key]: value
    }));
  }, []);

  return (
    <Stack spacing={3}>
      <FormControl fullWidth>
        <InputLabel shrink>Credential type</InputLabel>
        <OutlinedInput disabled value={cType.schema.title} />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel shrink>Attester</InputLabel>
        <OutlinedInput disabled value={cType.owner || 'Unknown attester'} />
      </FormControl>
      <Box />
      {Object.keys(cType.schema.properties).map((key) => (
        <CTypeItem
          key={key}
          name={key}
          onChange={onChange}
          type={cType.schema.properties[key].type}
        />
      ))}
      <LoadingButton fullWidth onClick={onSubmit} size="large" variant="contained">
        Submit
      </LoadingButton>
    </Stack>
  );
};

export default React.memo(CTypeForm);
