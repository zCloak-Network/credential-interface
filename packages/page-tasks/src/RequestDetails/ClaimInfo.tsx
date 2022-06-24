import Circle from '@mui/icons-material/Circle';
import { Box, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';

import { Attestation } from '@credential/app-db/attestation/Attestation';
import { Message } from '@credential/app-db/message';
import {
  RequestForAttestation,
  RequestForAttestationStatus
} from '@credential/app-db/requestForAttestation';
import { CredentialStatus, CTypeName, DidName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';

import Approve from './Approve';
import Reject from './Reject';
import Revoke from './Revoke';

const ClaimInfo: React.FC<{
  showActions: boolean;
  request: RequestForAttestation;
  attestation?: Attestation;
  messageLinked?: Message[];
}> = ({ attestation, messageLinked, request, showActions }) => {
  return (
    <Box sx={({ palette }) => ({ background: palette.common.white, paddingX: 8, paddingY: 4 })}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack alignItems="center" direction="row" spacing={3} sx={{ width: '60%' }}>
          <Circle sx={{ width: 70, height: 70 }} />
          <Box sx={{ width: 300 }}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>Claimer</Typography>
            <Typography sx={{ ...ellipsisMixin() }} variant="h4">
              <DidName type="light" value={request.claim.owner} />
            </Typography>
          </Box>
        </Stack>
        {showActions && (
          <Stack alignItems="center" direction="row" spacing={1.5}>
            {request.status === RequestForAttestationStatus.INIT && (
              <Approve messageLinked={messageLinked} request={request} />
            )}
            {request.status === RequestForAttestationStatus.INIT && (
              <Reject messageLinked={messageLinked} request={request} />
            )}
            {request.status === RequestForAttestationStatus.SUBMIT && attestation && (
              <Revoke attestation={attestation} messageLinked={messageLinked} request={request} />
            )}
          </Stack>
        )}
      </Box>
      <Box mt={5}>
        <Grid
          container
          spacing={{
            lg: 10,
            xs: 5
          }}
        >
          <Grid item lg={3} md={6} sm={12} xl={3} xs={12}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>Claim hash</Typography>
            <Typography sx={{ ...ellipsisMixin() }}>
              <DidName type="light" value={request.rootHash} />
            </Typography>
          </Grid>
          <Grid item lg={3} md={6} sm={12} xl={3} xs={12}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>
              Credential type
            </Typography>
            <Typography sx={{ ...ellipsisMixin() }}>
              <CTypeName cTypeHash={request.claim.cTypeHash} />
            </Typography>
          </Grid>
          <Grid item lg={3} md={6} sm={12} xl={3} xs={12}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>Status</Typography>
            <CredentialStatus
              revoked={attestation?.revoked}
              role="attester"
              status={request.status}
            />
          </Grid>
          <Grid item lg={3} md={6} sm={12} xl={3} xs={12}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>
              Approval initiation time
            </Typography>
            <Typography>{moment(request.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ClaimInfo;
