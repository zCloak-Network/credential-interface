import { KeyRelationship } from '@kiltprotocol/sdk-js';
import { Box, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import { u8aToHex } from '@polkadot/util';
import React, { useEffect, useMemo, useState } from 'react';

import { Copy, IdentityIcon } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { useDerivedDid } from '@credential/react-dids';
import DidCell from '@credential/react-dids/DidCell';
import { getW3Name } from '@credential/react-dids/getW3Name';

const KeyCell: React.FC<{ name: string; publicKeys?: Uint8Array[] }> = ({ name, publicKeys }) => {
  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography
        sx={({ palette }) => ({
          color: palette.grey[700]
        })}
        variant="inherit"
      >
        {name}
      </Typography>
      {publicKeys?.map((publicKey, index) => {
        const text = u8aToHex(publicKey);

        return (
          <Stack
            key={index}
            sx={{
              marginTop: 0.75,
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <Typography
              sx={{
                marginRight: 1,

                maxWidth: 'calc(100% - 20px)',
                ...ellipsisMixin()
              }}
              variant="inherit"
            >
              {text}
            </Typography>
            <Copy value={text} />
          </Stack>
        );
      })}
    </Box>
  );
};

const DidProfile: React.FC = () => {
  const [w3Name, setW3Name] = useState<string | null>(null);
  const didDetails = useDerivedDid();

  const authenticationKeys = useMemo(
    () =>
      didDetails
        ?.getVerificationKeys(KeyRelationship.authentication)
        .map(({ publicKey }) => publicKey),
    [didDetails]
  );
  const encryptionKeys = useMemo(
    () =>
      didDetails?.getEncryptionKeys(KeyRelationship.keyAgreement).map(({ publicKey }) => publicKey),
    [didDetails]
  );
  const assertionKeys = useMemo(
    () =>
      didDetails
        ?.getVerificationKeys(KeyRelationship.assertionMethod)
        .map(({ publicKey }) => publicKey),
    [didDetails]
  );
  const delegationKeys = useMemo(
    () =>
      didDetails
        ?.getVerificationKeys(KeyRelationship.capabilityDelegation)
        .map(({ publicKey }) => publicKey),
    [didDetails]
  );

  useEffect(() => {
    if (didDetails) {
      getW3Name(didDetails.uri).then(setW3Name);
    }
  }, [didDetails]);

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 200,
          background: 'url(/images/profile-bg.webp) no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      <Stack
        alignItems="center"
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        sx={{
          position: 'relative',
          zIndex: 1,
          marginLeft: { xs: 0, md: '56px' },
          marginTop: '-80px'
        }}
      >
        <Box sx={{ width: 168, height: 168, borderRadius: '84px', border: '4px solid #fff' }}>
          <IdentityIcon diameter={160} value={didDetails?.uri} />
        </Box>
        <Box marginLeft={{ md: 3, xs: 0 }} maxWidth="80%" width={400}>
          <Typography
            sx={{
              textAlign: { md: 'left', xs: 'center' },
              color: { md: 'white', xs: 'inherit' }
            }}
            variant="h1"
          >
            {w3Name ?? 'web3name'}
          </Typography>
          <Box marginTop={3}>
            <DidCell copyable value={didDetails?.uri} />
          </Box>
        </Box>
      </Stack>
      <Container maxWidth="md" sx={{ marginTop: { xs: 7, md: 14 } }}>
        <Tabs value={0}>
          <Tab label="Keys" />
        </Tabs>
        <Stack spacing={4}>
          <KeyCell name="Authentication Key" publicKeys={authenticationKeys} />
          <KeyCell name="Agreement Key Set" publicKeys={encryptionKeys} />
          <KeyCell name="Assertion Key" publicKeys={assertionKeys} />
          <KeyCell name="Delegation Key" publicKeys={delegationKeys} />
        </Stack>
      </Container>
    </Box>
  );
};

export default React.memo(DidProfile);
