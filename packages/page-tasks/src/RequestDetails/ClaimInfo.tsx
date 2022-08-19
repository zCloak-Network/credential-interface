import type { IAttestation, IRequestAttestation, MessageBody } from '@kiltprotocol/sdk-js';

import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
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

function Cell({ content, label }: { label: string; content: React.ReactNode }) {
  return (
    <Grid
      lg={3}
      sx={{
        display: { xs: 'flex', sm: 'block' },
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      xl={3}
      xs={4}
    >
      <Typography
        sx={({ palette, typography }) => ({
          color: palette.grey[700],
          fontSize: { xs: typography.fontSize, sm: 'inherit' },
          width: { xs: '50%', sm: '100%' }
        })}
      >
        {label}
      </Typography>
      <Box
        sx={{
          width: { xs: '50%', sm: '100%' },
          display: 'flex',
          flexDirection: { xs: 'row-reverse', sm: 'row' }
        }}
      >
        {content}
      </Box>
    </Grid>
  );
}

const ClaimInfo: React.FC<{
  showActions: boolean;
  request: Message<IRequestAttestation>;
  attestation?: IAttestation | null;
  status: RequestStatus;
  messageLinked?: Message<MessageBody>[];
}> = ({ attestation, messageLinked, request, showActions, status }) => {
  return (
    <Box
      sx={({ palette }) => ({
        background: palette.common.white,
        paddingX: { xs: 4, md: 8 },
        paddingY: 4
      })}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack alignItems="center" direction="row" spacing={3} sx={{ width: '60%' }}>
          <IdentityIcon
            diameter={70}
            value={request.body.content.requestForAttestation.claim.owner}
          />
          <Box sx={{ width: 300 }}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>Claimer</Typography>
            <Typography sx={{ ...ellipsisMixin() }} variant="h4">
              <DidName value={request.body.content.requestForAttestation.claim.owner} />
            </Typography>
          </Box>
        </Stack>
        {showActions && (
          <Stack
            alignItems="center"
            direction="row"
            spacing={1.5}
            sx={{ display: { md: 'flex', xs: 'none' } }}
          >
            {status === RequestStatus.INIT && (
              <Approve messageLinked={messageLinked} request={request} />
            )}
            {status === RequestStatus.INIT && (
              <Reject messageLinked={messageLinked} request={request} />
            )}
            {status === RequestStatus.SUBMIT && attestation && !attestation.revoked && (
              <Revoke attestation={attestation} messageLinked={messageLinked} request={request} />
            )}
          </Stack>
        )}
      </Box>
      <Box mt={5}>
        <Grid
          columns={{ xs: 4, sm: 8, lg: 12 }}
          container
          spacing={{
            lg: 6,
            xs: 3
          }}
        >
          <Cell
            content={
              <Typography sx={{ ...ellipsisMixin() }} variant="inherit">
                {request.body.content.requestForAttestation.rootHash}
              </Typography>
            }
            label="Claim hash"
          />
          <Cell
            content={
              <Typography sx={{ ...ellipsisMixin() }} variant="inherit">
                <CTypeName cTypeHash={request.body.content.requestForAttestation.claim.cTypeHash} />
              </Typography>
            }
            label="Credential type"
          />
          <Cell
            content={
              <Stack alignItems="center" direction="row" spacing={0.75}>
                <CredentialStatus
                  revoked={attestation?.revoked}
                  role="attester"
                  showText={!attestation?.owner}
                  status={status}
                />
                {attestation?.owner && (
                  <Typography
                    sx={({ palette }) => ({ color: palette.grey[700] })}
                    variant="inherit"
                  >
                    <DidName value={attestation.owner} />
                  </Typography>
                )}
              </Stack>
            }
            label={attestation?.owner ? 'Status' : 'Attested by'}
          />
          <Cell
            content={
              <Typography variant="inherit">
                {moment(request.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Typography>
            }
            label="Request time"
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default ClaimInfo;
