import { Message } from '@kiltprotocol/sdk-js';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useMemo, useState } from 'react';

import CredentialCell from './CredentialCell';
import { useCredentials } from './useCredentials';

const list = [
  {
    request: new Message(
      {
        type: Message.BodyType.REQUEST_ATTESTATION,
        content: {
          requestForAttestation: {
            claim: {
              cTypeHash: '0xdf50a915b489160b9bc1fb114c342161438d55c7f10c8b606adbe1f6d0e16281',
              contents: { discord_user_id: 'zzc#5538', zkid_verification_code: 'tLySXwJU0t' },
              owner: 'did:kilt:4oce7v2ZHzY5GnVY8fRusKdBcUPvx3xCGfVaTH7UzCMGyxzG'
            },
            claimHashes: [
              '0x232d6d2fd45f10ed7cdeb5f67d1a9c0c476a61aa5b0fd1968ef8c12fb7d8237d',
              '0xbbdbd53ffabfa9db9aac25a2665720d3ab80ec6ff7afcb1de65cff8387eaf781',
              '0xfac718306162a2161a6af248e541a517962881bb6c7527beefd563891176db07'
            ],
            claimNonceMap: {
              '0x9c8fc9acee44f1c13fd27885fd05d291223966f0b3663a6ac7f07e10a75aa2d0':
                '6a3e79b9-176b-45ae-94c1-66eaa51274b1',
              '0x9ffe6a3ac6084518f9bbad919dcc4bdb8a9eeb0d8d9b83f9e99dabae2468e8e6':
                '91628b7f-cb20-4e90-bb1c-be1a40eabc70',
              '0x5e34875ab8a273c2d1d8d6ab839c033ab94114f3104ae9943476331f77387fbe':
                'c6c711d4-9957-4679-8d1c-7e58ee2fe09e'
            },
            legitimations: [],
            delegationId: null,
            rootHash: '0xc8259065d4a2e0373fa401902746b7178d1af16779f5a29e33d3cb05c6088167',
            claimerSignature: {
              signature:
                '0x7ec3de0ddf42b0c3dad346560936838d96d50186446a51fe1eca6a7a3281f61fb3125a9dd684b9d14960460362710803e37e88a8facb684e85b2f076f760848b',
              keyUri:
                'did:kilt:4oce7v2ZHzY5GnVY8fRusKdBcUPvx3xCGfVaTH7UzCMGyxzG#0x97150d68ac00211cf09892ccefee941bd7e0dd78d66463d6564a070e32e3cecb'
            }
          }
        }
      },
      'did:kilt:4oce7v2ZHzY5GnVY8fRusKdBcUPvx3xCGfVaTH7UzCMGyxzG',
      'did:kilt:4obf6LAUCg9NsFmxarhQ2zVMipYJFC1SmvbK1LEWYffEMR6z'
    ),
    attestation: {
      claimHash: '0xc8259065d4a2e0373fa401902746b7178d1af16779f5a29e33d3cb05c6088167',
      cTypeHash: '0xdf50a915b489160b9bc1fb114c342161438d55c7f10c8b606adbe1f6d0e16281',
      delegationId: null,
      owner: 'did:kilt:4obf6LAUCg9NsFmxarhQ2zVMipYJFC1SmvbK1LEWYffEMR6z',
      revoked: false
    }
  }
];

const Claims: React.FC = () => {
  const [type, setType] = useState(0);
  const credentials = useCredentials();

  // const list = useMemo(() => {
  //   return type === 0
  //     ? credentials ?? []
  //     : credentials?.filter(({ attestation }) => !!attestation && !attestation.revoked) ?? [];
  // }, [credentials, type]);
  return (
    <Stack spacing={4}>
      <Typography variant="h2">Credentials</Typography>
      <Tabs onChange={(_, value) => setType(value)} value={type}>
        <Tab label="All credentials" />
        <Tab label="Attested" />
      </Tabs>
      <Box>
        <Grid columns={{ xs: 4, sm: 8, lg: 12 }} container spacing={3}>
          {list.map(({ attestation, request }) => (
            <Grid key={request.messageId} lg={4} xl={3} xs={4}>
              <CredentialCell attestation={attestation} request={request} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
};

export default Claims;
