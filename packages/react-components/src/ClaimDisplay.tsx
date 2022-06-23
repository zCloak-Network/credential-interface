import type { IClaimContents } from '@kiltprotocol/types';

import { Grid, OutlinedInput, Typography } from '@mui/material';
import React from 'react';

const ClaimDisplay: React.FC<{ contents: IClaimContents }> = ({ contents }) => {
  return (
    <>
      {Object.entries(contents).map(([key, value]) => (
        <Grid alignItems="center" container key={key} spacing={2} sx={{ marginTop: 3 }}>
          <Grid item sm={4} sx={{ textAlign: 'right' }}>
            <Typography sx={({ palette }) => ({ color: palette.grey[600] })}>{key}</Typography>
          </Grid>
          <Grid item sm={8}>
            <OutlinedInput fullWidth size="small" value={value.toString()} />
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default React.memo(ClaimDisplay);
