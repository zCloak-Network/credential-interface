import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { IconImport } from '@credential/app-config/icons';
import { NotificationContext, ZkidExtensionContext } from '@credential/react-components';

const ImportButton: React.FC<{ withText?: boolean }> = ({ withText = false }) => {
  const { notifyError } = useContext(NotificationContext);
  const { isInstall, zkidExtension } = useContext(ZkidExtensionContext);

  const importToExtension: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();

      if (isInstall) {
        zkidExtension.openzkIDPopup('OPEN_IMPORT_CREDENTIAL', undefined);
      } else {
        notifyError(new Error('zkID Wallet extension not install'));
      }
    },
    [isInstall, notifyError, zkidExtension]
  );

  return (
    <Tooltip title="Import to extension">
      <Stack alignItems="center">
        <IconButton onClick={importToExtension}>
          <IconImport />
        </IconButton>
        {withText && (
          <Typography sx={({ palette }) => ({ color: palette.common.white })} variant="inherit">
            Import
          </Typography>
        )}
      </Stack>
    </Tooltip>
  );
};

export default React.memo(ImportButton);
