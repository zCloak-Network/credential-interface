import Circle from '@mui/icons-material/Circle';
import { Box, Grid, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';

import { RequestForAttestation } from '@credential/app-db/requestForAttestation';
import { CTypeName, DidName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';

import AttestationStatus from '../AttestationStatus';
import Approve from './Approve';
import Reject from './Reject';

const ClaimInfo: React.FC<{
  request: RequestForAttestation;
}> = ({ request }) => {
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
        <Stack alignItems="center" direction="row" spacing={1.5}>
          <Approve request={request} />
          <Reject request={request} />
        </Stack>
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
            <AttestationStatus status={request.status} />
          </Grid>
          <Grid item lg={3} md={6} sm={12} xl={3} xs={12}>
            <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>
              Approval initiation time
            </Typography>
            <Typography>{moment(request.createAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ClaimInfo;
