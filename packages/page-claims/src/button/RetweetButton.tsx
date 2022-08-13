import { ICredential } from '@kiltprotocol/sdk-js';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback } from 'react';

import { IconTwitter } from '@credential/app-config/icons';

const RetweetButton: React.FC<{ credential: ICredential; withText?: boolean }> = ({
  credential,
  withText = false
}) => {
  const retweet = useCallback(() => {
    const search = new URLSearchParams();

    search.append(
      'text',
      `My did: ${credential.request.claim.owner}

Attester: ${credential.attestation.owner}

Credential type hash: ${credential.attestation.cTypeHash}

https://zkid.app`
    );
    window.open(`https://twitter.com/intent/tweet?${search}`);
  }, [
    credential.attestation.cTypeHash,
    credential.attestation.owner,
    credential.request.claim.owner
  ]);

  return (
    <Tooltip title="Retweet">
      <Stack alignItems="center">
        <IconButton onClick={retweet}>
          <IconTwitter />
        </IconButton>
        {withText && (
          <Typography sx={({ palette }) => ({ color: palette.common.white })} variant="inherit">
            Retweet
          </Typography>
        )}
      </Stack>
    </Tooltip>
  );
};

export default React.memo(RetweetButton);
