import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

import { AppContext, useClaimer } from '@credential/react-components';
import { useCredentials } from '@credential/react-hooks';

import CreateClaim from './CreateClaim';
import CredentialCell from './CredentialCell';

const Claims: React.FC = () => {
  const { db } = useContext(AppContext);
  const [type, setType] = useState(0);
  const { claimer } = useClaimer();
  const credentials = useCredentials(db, claimer.didDetails.uri);

  const list = useMemo(() => {
    return type === 0
      ? credentials ?? []
      : credentials?.filter(({ attestation }) => !!attestation) ?? [];
  }, [credentials, type]);

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
            {list.map(({ attestation, request }, index) => (
              <Grid item key={index} lg={4} md={6} sm={12} xl={3} xs={12}>
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
