import { ICredential } from '@kiltprotocol/sdk-js';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback } from 'react';

import { IconQrcode } from '@credential/app-config/icons';
import { useToggle } from '@credential/react-hooks';

const QrcodeButton: React.FC<{ credential: ICredential; withText?: boolean }> = ({
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
      <Tooltip title="Show QR code">
        <Stack alignItems="center">
          <IconButton onClick={_toggleOpen}>
            <IconQrcode />
          </IconButton>
          {withText && (
            <Typography sx={({ palette }) => ({ color: palette.common.white })} variant="inherit">
              QR code
            </Typography>
          )}
        </Stack>
      </Tooltip>
    </>
  );
};

export default React.memo(QrcodeButton);
