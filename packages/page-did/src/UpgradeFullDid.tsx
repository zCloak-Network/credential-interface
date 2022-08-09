import type { BN } from '@polkadot/util';

import { Box, Typography } from '@mui/material';
import React, { useContext } from 'react';

import { FormatBalance } from '@credential/react-components';
import { DidsContext, FullDidCreation } from '@credential/react-dids';

const UpgradeFullDid: React.FC = () => {
  const { blockchain } = useContext(DidsContext);

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
        need to stake <FormatBalance value={blockchain.api.consts.did.deposit as unknown as BN} />{' '}
        KILT for this step.
      </Typography>
      <FullDidCreation />
    </Box>
  );
};

export default React.memo(UpgradeFullDid);
