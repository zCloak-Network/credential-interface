import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { DidsContext } from '@credential/react-dids';
import { useCredentials } from '@credential/react-hooks';

import CreateClaim from './CreateClaim';
import CredentialCell from './CredentialCell';

const Claims: React.FC = () => {
  const { didUri } = useContext(DidsContext);
  const [type, setType] = useState(0);
  const filter = useMemo(() => ({ owner: didUri }), [didUri]);
  const credentials = useCredentials(endpoint.db, filter);

  const list = useMemo(() => {
    return type === 0
      ? credentials?.filter(({ attestation }) => !attestation) ?? []
      : credentials?.filter(({ attestation }) => !!attestation && !attestation.revoked) ?? [];
  }, [credentials, type]);

  return (
    <>
      <Stack spacing={4}>
        <Typography variant="h2">Credentials</Typography>
        <Tabs onChange={(_, value) => setType(value)} value={type}>
          <Tab label="My Claims" />
          <Tab label="My Credentials" />
        </Tabs>
        <Box>
          <Grid container spacing={3}>
            {list.map(({ attestation, request }) => (
              <Grid item key={request.rootHash} lg={4} md={6} sm={12} xl={3} xs={12}>
                <CredentialCell attestation={attestation} request={request} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
      <CreateClaim />
    </>
  );
};

export default Claims;
