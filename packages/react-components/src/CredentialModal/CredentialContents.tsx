import type { DidUri, Hash, IClaimContents } from '@kiltprotocol/sdk-js';

import { Box, Divider, lighten, Link, Paper, Stack, SvgIcon, Typography } from '@mui/material';
import React from 'react';

import { LogoCircleIcon } from '@credential/app-config/icons';
import { DidName } from '@credential/react-dids';
import { RequestStatus } from '@credential/react-hooks/types';

import ClaimDisplay, { ClaimItem } from '../ClaimDisplay';
import CredentialStatus from '../CredentialStatus';
import CTypeName from '../CTypeName';

interface Props {
  ctypeHash: Hash;
  owner: DidUri;
  status: RequestStatus;
  attester: DidUri;
  revoked: boolean;
  contents: IClaimContents;
}

const CredentialContents: React.FC<Props> = ({
  attester,
  contents,
  ctypeHash,
  owner,
  revoked,
  status
}) => {
  return (
    <Paper
      sx={({ palette }) => ({
        background: lighten(palette.primary.main, 0.92),
        borderRadius: 2.5,
        marginTop: '94px'
      })}
      variant="outlined"
    >
      <Stack alignItems="center" marginBottom={5.5} marginTop="-30px" spacing={2}>
        <SvgIcon component={LogoCircleIcon} sx={{ fontSize: 60 }} viewBox="0 0 60 60" />
        <Box textAlign="center">
          <Typography variant="h3">
            <CTypeName cTypeHash={ctypeHash} />
          </Typography>
          <Typography>
            <CredentialStatus revoked={revoked} role="claimer" showText={false} status={status} />
            <Link marginLeft={1}>
              Attested by: <DidName value={attester} />
            </Link>
          </Typography>
        </Box>
      </Stack>
      <ClaimItem label="Credential owner" value={<DidName value={owner} />} />
      <Divider sx={({ palette }) => ({ marginY: 3, borderColor: palette.grey[300] })} />
      <Box paddingBottom={5}>
        <ClaimDisplay contents={contents} />
      </Box>
    </Paper>
  );
};

export default React.memo(CredentialContents);
