import Circle from '@mui/icons-material/Circle';
import { Stack, Typography } from '@mui/material';
import React from 'react';

const Status: React.FC<{ verified: boolean; revoked: boolean }> = ({ revoked, verified }) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={({ palette }) => ({
        display: 'inline-flex',
        alignItems: 'center',
        direction: 'row',
        color: verified ? palette.success.main : revoked ? palette.error.main : palette.warning.main
      })}
    >
      <Circle sx={{ width: 10, height: 10 }} />
      <Typography variant="inherit">
        {verified ? 'Passed' : revoked ? 'Revoked' : 'Verifying'}
      </Typography>
    </Stack>
  );
};

export default React.memo(Status);
