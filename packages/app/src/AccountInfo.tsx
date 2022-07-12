import { DidUri } from '@kiltprotocol/sdk-js';
import { alpha, Button } from '@mui/material';
import React from 'react';

import { IdentityIcon } from '@credential/react-components';
import { DidName } from '@credential/react-dids';

interface Props {
  did: DidUri;
}

const AccountInfo: React.FC<Props> = ({ did }) => {
  return (
    <Button
      endIcon={<IdentityIcon value={did} />}
      sx={({ palette }) => ({
        border: '1px solid',
        borderColor: alpha(palette.primary.main, 0.12),
        background: palette.common.white,
        borderRadius: 50,
        boxShadow: 'none',
        color: palette.text.primary,
        ':hover': {
          background: palette.common.white
        }
      })}
      variant="contained"
    >
      <DidName value={did} />
    </Button>
  );
};

export default React.memo(AccountInfo);
