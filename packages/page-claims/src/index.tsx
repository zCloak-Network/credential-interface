import { Did } from '@kiltprotocol/sdk-js';
import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

import { CredentialContenxt, useClaimer } from '@credential/react-components';

import CreateClaim from './CreateClaim';
import CredentialCell from './CredentialCell';

const Claims: React.FC = () => {
  const { credentials, verifiedCredentials } = useContext(CredentialContenxt);
  const [type, setType] = useState(0);
  const { claimer } = useClaimer();

  const myCredentials = useMemo(() => {
    return (type === 0 ? credentials : verifiedCredentials).filter((credential) =>
      Did.Utils.isSameSubject(credential.credential.request.claim.owner, claimer.didDetails.uri)
    );
  }, [claimer, credentials, type, verifiedCredentials]);

  return (
    <>
      <Stack spacing={4}>
        <Typography variant="h2">Claims</Typography>
        <Tabs onChange={(_, value) => setType(value)} value={type}>
          <Tab label="My Claims" />
          <Tab label="My Credentials" />
        </Tabs>
        <Box>
          <Grid container spacing={3}>
            {myCredentials.map((credential, index) => (
              <Grid item key={index} lg={4} md={6} sm={12} xl={3} xs={12}>
                <CredentialCell item={credential} />
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
