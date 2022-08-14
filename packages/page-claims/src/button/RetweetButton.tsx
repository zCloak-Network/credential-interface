import { ICredential } from '@kiltprotocol/sdk-js';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback } from 'react';

import { IconTwitter } from '@credential/app-config/icons';
import { getW3Name } from '@credential/react-dids/getW3Name';

const RetweetButton: React.FC<{ credential: ICredential; withText?: boolean }> = ({
  credential,
  withText = false
}) => {
  const retweet = useCallback(async () => {
    const search = new URLSearchParams();

    const w3Name = await getW3Name(credential.attestation.owner);

    search.append(
      'text',
      `I have claimed my @zCloakNetwork Membership Credential.

      Credential type hash: ${credential.attestation.cTypeHash}

      Attester: ${w3Name || credential.attestation.owner}

      Come get yours at: https://zkid.app`
    );
    window.open(`https://twitter.com/intent/tweet?${search}`);
  }, [credential.attestation.cTypeHash, credential.attestation.owner]);

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
