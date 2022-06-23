import Circle from '@mui/icons-material/Circle';
import { Stack, SvgIcon, Typography } from '@mui/material';
import React from 'react';

import { RequestForAttestationStatus } from '@credential/app-db/requestForAttestation';

const AttestationStatus: React.FC<{ status: RequestForAttestationStatus }> = ({ status }) => {
  return (
    <Stack alignItems="center" direction="row" spacing={1}>
      <SvgIcon
        component={Circle}
        sx={({ palette }) => ({
          width: 8,
          height: 8,
          color:
            status === RequestForAttestationStatus.INIT
              ? palette.grey[500]
              : status === RequestForAttestationStatus.SUBMIT
              ? palette.success.main
              : palette.error.main
        })}
      />
      <Typography variant="inherit">
        {status === RequestForAttestationStatus.INIT
          ? 'Invalid'
          : status === RequestForAttestationStatus.SUBMIT
          ? 'Submit'
          : 'Reject'}
      </Typography>
    </Stack>
  );
};

export default React.memo(AttestationStatus);
