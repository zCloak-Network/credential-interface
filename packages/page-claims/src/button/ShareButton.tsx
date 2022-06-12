import type { ICredential } from '@kiltprotocol/sdk-js';

import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

import { IconForward } from '@credential/app-config/icons';
import { useToggle } from '@credential/react-hooks';

import ShareCredential from '../ShareCredential';

const ShareButton: React.FC<{ credential: ICredential }> = ({ credential }) => {
  const [open, toggleOpen] = useToggle();

  return (
    <>
      <Tooltip title="Share to other">
        <IconButton onClick={toggleOpen}>
          <IconForward />
        </IconButton>
      </Tooltip>
      <ShareCredential credential={credential} onClose={toggleOpen} open={open} />
    </>
  );
};

export default React.memo(ShareButton);
