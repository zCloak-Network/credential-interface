import Circle from '@mui/icons-material/Circle';
import { Stack, Typography } from '@mui/material';
import React from 'react';

import { RequestForAttestationStatus } from '@credential/app-db/requestForAttestation';

const Status: React.FC<{ status: RequestForAttestationStatus }> = ({ status }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={({ palette }) => ({
        display: 'inline-flex',
        alignItems: 'center',
        direction: 'row',
        color:
          status === RequestForAttestationStatus.SUBMIT
            ? palette.success.main
            : status === RequestForAttestationStatus.REJECT
            ? palette.error.main
            : palette.warning.main
      })}
    >
      <Circle sx={{ width: 10, height: 10 }} />
      <Typography variant="inherit">
        {status === RequestForAttestationStatus.SUBMIT
          ? 'Passed'
          : status === RequestForAttestationStatus.REJECT
          ? 'Reject'
          : 'Verifying'}
      </Typography>
    </Stack>
  );
};

export default React.memo(Status);
