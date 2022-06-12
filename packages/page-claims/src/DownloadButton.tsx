import { ICredential } from '@kiltprotocol/sdk-js';
import { IconButton, Tooltip } from '@mui/material';
import FileSaver from 'file-saver';
import React, { useCallback } from 'react';

import { IconDownload } from '@credential/app-config/icons';

const ImportButton: React.FC<{ credential: ICredential }> = ({ credential }) => {
  const download = useCallback(() => {
    const blob = new Blob([JSON.stringify(credential)], {
      type: 'text/plain;charset=utf-8'
    });

    FileSaver.saveAs(blob, 'credential.json');
  }, [credential]);

  return (
    <Tooltip title="Download">
      <IconButton onClick={download}>
        <IconDownload />
      </IconButton>
    </Tooltip>
  );
};

export default React.memo(ImportButton);
