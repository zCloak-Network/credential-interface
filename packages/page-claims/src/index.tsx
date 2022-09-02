import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useMemo, useState } from 'react';

import { useCredentials } from '@credential/react-hooks';

import CredentialCell, { CredentialProps } from './CredentialCell';
import ImportCredential from './ImportCredential';
import { useCredentialsFromMessage } from './useCredentials';

function unique(credentials: CredentialProps[]): CredentialProps[] {
  const set = new Set();

  return credentials.filter((c) => {
    if (set.has(c.request.rootHash)) {
      return false;
    } else {
      set.add(c.request.rootHash);

      return true;
    }
  });
}

const Claims: React.FC = () => {
  const [type, setType] = useState(0);
  const credentialsFromMessage = useCredentialsFromMessage();
  const credentials = useCredentials();

  const list = useMemo((): CredentialProps[] => {
    return unique(
      credentials.map((credential) => ({
        request: credential.request,
        attestation: credential.attestation,
        time: credential.attestedTime || credential.requestTime || credential.updateTime,
        attester: credential.attestation.owner
      })) as CredentialProps[]
    )
      .concat(
        credentialsFromMessage.map(({ attestation, request }) => ({
          request: request.body.content.requestForAttestation,
          attestation,
          time: request.createdAt,
          attester: attestation?.owner || request.receiver
        }))
      )
      .filter((credential) => (type === 0 ? true : !!credential.attestation));
  }, [credentials, credentialsFromMessage, type]);

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 3
        }}
      >
        <Typography variant="h2">Credentials</Typography>
        <ImportCredential />
      </Box>
      <Tabs onChange={(_, value) => setType(value)} value={type}>
        <Tab label="All credentials" />
        <Tab label="Attested" />
      </Tabs>
      <Box>
        <Grid columns={{ xs: 4, sm: 8, lg: 12 }} container spacing={3}>
          {list.map(({ attestation, attester, request, time }, index) => (
            <Grid key={index} lg={4} xl={3} xs={4}>
              <CredentialCell
                attestation={attestation}
                attester={attester}
                request={request}
                time={time}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

export default Claims;
