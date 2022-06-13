import type { ICredential } from '@kiltprotocol/sdk-js';

import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback } from 'react';

import { IconForward } from '@credential/app-config/icons';
import { useToggle } from '@credential/react-hooks';

import ShareCredential from '../ShareCredential';

const ShareButton: React.FC<{ credential: ICredential; withText?: boolean }> = ({
  credential,
  withText = false
}) => {
  const [open, toggleOpen] = useToggle();

  const _toggleOpen: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      toggleOpen();
    },
    [toggleOpen]
  );

  return (
    <>
      <Tooltip title="Share to other">
        <Stack alignItems="center">
          <IconButton onClick={_toggleOpen}>
            <IconForward />
          </IconButton>
          {withText && (
            <Typography sx={{ color: '#fff' }} variant="inherit">
              Share
            </Typography>
          )}
        </Stack>
      </Tooltip>
      <ShareCredential credential={credential} onClose={toggleOpen} open={open} />
    </>
  );
};

export default React.memo(ShareButton);
