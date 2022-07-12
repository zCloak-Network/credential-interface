import type { IAttestation } from '@kiltprotocol/sdk-js';

import type { Request } from '@credential/react-hooks/types';

import { Box, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';

import { Message } from '@credential/app-db/message';
import { CredentialStatus, CTypeName, IdentityIcon } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { RequestStatus } from '@credential/react-hooks/types';

import Approve from './Approve';
import Reject from './Reject';
import Revoke from './Revoke';

const ClaimInfo: React.FC<{
  showActions: boolean;
  request: Request;
  attestation?: IAttestation | null;
  messageLinked?: Message[];
}> = ({ attestation, messageLinked, request, showActions }) => {
  return (
    <Box sx={({ palette }) => ({ background: palette.common.white, paddingX: 8, paddingY: 4 })}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack alignItems="center" direction="row" spacing={3} sx={{ width: '60%' }}>
          <IdentityIcon diameter={70} value={request.claim.owner} />
          <Box sx={{ width: 300 }}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>Claimer</Typography>
            <Typography sx={{ ...ellipsisMixin() }} variant="h4">
              <DidName value={request.claim.owner} />
            </Typography>
          </Box>
        </Stack>
        {showActions && (
          <Stack alignItems="center" direction="row" spacing={1.5}>
            {request.status === RequestStatus.INIT && (
              <Approve messageLinked={messageLinked} request={request} />
            )}
            {request.status === RequestStatus.INIT && (
              <Reject messageLinked={messageLinked} request={request} />
            )}
            {request.status === RequestStatus.SUBMIT && attestation && !attestation.revoked && (
              <Revoke attestation={attestation} messageLinked={messageLinked} request={request} />
            )}
          </Stack>
        )}
      </Box>
      <Box mt={5}>
        <Grid
          container
          spacing={{
            lg: 6,
            xs: 3
          }}
        >
          <Grid item lg={3} md={6} sm={12} xl={3} xs={12}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>Claim hash</Typography>
            <Typography sx={{ ...ellipsisMixin() }} variant="inherit">
              {request.rootHash}
            </Typography>
          </Grid>
          <Grid item lg={3} md={6} sm={12} xl={3} xs={12}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>
              Credential type
            </Typography>
            <Typography sx={{ ...ellipsisMixin() }} variant="inherit">
              <CTypeName cTypeHash={request.claim.cTypeHash} />
            </Typography>
          </Grid>
          <Grid item lg={3} md={6} sm={12} xl={3} xs={12}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>
              {attestation?.owner ? 'Status' : 'Attested by'}
            </Typography>
            <Stack alignItems="center" direction="row" spacing={0.75}>
              <CredentialStatus
                revoked={attestation?.revoked}
                role="attester"
                showText={!attestation?.owner}
                status={request.status}
              />
              {attestation?.owner && (
                <Typography sx={({ palette }) => ({ color: palette.grey[700] })} variant="inherit">
                  <DidName value={attestation.owner} />
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid item lg={3} md={6} sm={12} xl={3} xs={12}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>
              Approval initiation time
            </Typography>
            <Typography variant="inherit">
              {moment(request.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ClaimInfo;
