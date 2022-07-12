import { Box, Typography } from '@mui/material';
import React from 'react';

import { FullDidCreation } from '@credential/react-dids';

const UpgradeFullDid: React.FC = () => {
  return (
    <Box sx={{ width: 458, margin: '40px auto' }}>
      <Typography sx={{ textAlign: 'center' }} variant="h5">
        Upgrade to FullDID
      </Typography>
      <Typography
        color={({ palette }) => palette.grey[700]}
        sx={{ marginTop: 2, marginBottom: 4.5 }}
        variant="inherit"
      >
        To unlock all functions of the attester, you need to upgrade your account to fullDID. You
        need to stake xxxx KILT for this step.
      </Typography>
      <FullDidCreation />
    </Box>
  );
};

export default React.memo(UpgradeFullDid);
