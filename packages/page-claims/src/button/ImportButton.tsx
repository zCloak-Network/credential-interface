import { IconButton, Tooltip } from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { IconImport } from '@credential/app-config/icons';
import { NotificationContext, ZkidExtensionContext } from '@credential/react-components';

const ImportButton: React.FC = () => {
  const { notifyError } = useContext(NotificationContext);
  const { isInstall, zkidExtension } = useContext(ZkidExtensionContext);

  const importToExtension = useCallback(() => {
    if (isInstall) {
      zkidExtension.openzkIDPopup('OPEN_IMPORT_CREDENTIAL', undefined);
    } else {
      notifyError(new Error('zkID Wallet extension not install'));
    }
  }, [isInstall, notifyError, zkidExtension]);

  return (
    <Tooltip title="Import to extension">
      <IconButton onClick={importToExtension}>
        <IconImport />
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(ImportButton);
