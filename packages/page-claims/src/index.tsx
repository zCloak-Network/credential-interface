import { Box, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';

import CredentialCell from './CredentialCell';
import { useCredentials } from './useCredentials';

const Claims: React.FC = () => {
  const [type, setType] = useState(0);
  const credentials = useCredentials();

  const list = useMemo(() => {
    return type === 0
      ? credentials ?? []
      : credentials?.filter(({ attestation }) => !!attestation && !attestation.revoked) ?? [];
  }, [credentials, type]);

  return (
    <Stack spacing={4}>
      <Typography variant="h2">Credentials</Typography>
      <Tabs onChange={(_, value) => setType(value)} value={type}>
        <Tab label="All credentials" />
        <Tab label="Attested" />
      </Tabs>
      <Box>
        <Grid container spacing={3}>
          {list.map(({ attestation, request }) => (
            <Grid item key={request.messageId} lg={4} md={6} sm={12} xl={3} xs={12}>
              <CredentialCell attestation={attestation} request={request} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

export default Claims;
