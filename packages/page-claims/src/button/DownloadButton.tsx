import { ICredential } from '@kiltprotocol/sdk-js';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import FileSaver from 'file-saver';
import React, { useCallback } from 'react';

import { IconDownload } from '@credential/app-config/icons';

const ImportButton: React.FC<{ credential: ICredential; withText?: boolean }> = ({
  credential,
  withText = false
}) => {
  const download: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();

      const blob = new Blob([JSON.stringify(credential)], {
        type: 'text/plain;charset=utf-8'
      });

      FileSaver.saveAs(blob, 'credential.json');
    },
    [credential]
  );

  return (
    <Tooltip title="Download">
      <Stack alignItems="center">
        <IconButton onClick={download}>
          <IconDownload />
        </IconButton>
        {withText && (
          <Typography sx={{ color: '#fff' }} variant="inherit">
            Download
          </Typography>
        )}
      </Stack>
    </Tooltip>
  );
};

export default React.memo(ImportButton);
