import { type ICredential, Credential, CType } from '@kiltprotocol/sdk-js';
import Circle from '@mui/icons-material/Circle';
import { Box, IconButton, Paper, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { IconDownload, IconForward } from '@credential/app-config/icons';
import { CTypeContext } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { useToggle } from '@credential/react-hooks';

const CredentialCell: React.FC<{ item: ICredential }> = ({ item }) => {
  const [enter, toggleEnter] = useToggle(false);
  const [verified, setVerified] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { cTypeList } = useContext(CTypeContext);
  const credential = useMemo(() => Credential.fromCredential(item), [item]);

  const cType = useMemo(() => {
    return cTypeList.find(
      (cType) =>
        CType.fromSchema(cType.schema, cType.owner).hash === credential.attestation.cTypeHash
    );
  }, [cTypeList, credential.attestation.cTypeHash]);

  useEffect(() => {
    credential
      .verify()
      .then(setVerified)
      .finally(() => setFetching(false));
  }, [credential]);

  if (fetching) {
    return (
      <Stack spacing={1}>
        <Skeleton height={40} variant="circular" width={40} />
        <Skeleton height={118} variant="rectangular" width={210} />
        <Skeleton variant="text" />
      </Stack>
    );
  }

  return (
    <Box onMouseEnter={toggleEnter} onMouseLeave={toggleEnter} position="relative">
      <Paper
        component={Stack}
        elevation={enter ? 3 : 1}
        spacing={3}
        sx={{
          cursor: 'pointer',
          position: 'relative',
          padding: 4,
          height: 211,
          borderRadius: 5,
          background: enter
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(174, 192, 249, 0.05) 67%, rgba(94, 129, 244, 0.1) 100%)'
            : undefined
        }}
      >
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
            sx={({ palette }) => ({
              color: verified
                ? palette.success.main
                : credential.attestation.revoked
                ? palette.error.main
                : palette.warning.main
            })}
          >
            <Circle sx={{ width: 10, height: 10 }} />
            <Typography variant="inherit">
              {verified ? 'Passed' : credential.attestation.revoked ? 'Revoked' : 'Verifying'}
            </Typography>
          </Stack>
          <Typography
            sx={({ transitions }) => ({
              opacity: enter ? 1 : 0,

              transition: transitions.create('opacity', {
                easing: transitions.easing.sharp,
                duration: transitions.duration.enteringScreen
              })
            })}
            variant="h4"
          >
            {cType?.schema.title}
          </Typography>
        </Stack>
        <Tooltip title={cType?.schema.title ?? ''}>
          <Typography
            sx={({ transitions }) => ({
              lineHeight: enter ? 0 : 1,
              opacity: enter ? 0 : 1,
              marginTop: enter ? '0 !important' : undefined,
              ...ellipsisMixin(),

              transition: transitions.create(['line-height', 'margin-top'], {
                easing: transitions.easing.sharp,
                duration: transitions.duration.enteringScreen
              })
            })}
            variant="h3"
          >
            {cType?.schema.title ?? '--'}
          </Typography>
        </Tooltip>
        <Stack direction="row" lineHeight={1} spacing={1}>
          <Box width="50%">
            <Typography sx={({ palette }) => ({ color: palette.grey[500] })} variant="inherit">
              Attested by
            </Typography>
            <Tooltip placement="top" title={credential.attestation.owner}>
              <Typography
                sx={{
                  fontWeight: 500,
                  ...ellipsisMixin()
                }}
              >
                {credential.attestation.owner}
              </Typography>
            </Tooltip>
          </Box>
          <Box width="50%">
            <Typography sx={({ palette }) => ({ color: palette.grey[500] })} variant="inherit">
              Claim hash
            </Typography>
            <Tooltip placement="top" title={credential.attestation.claimHash}>
              <Typography
                sx={{
                  fontWeight: 500,
                  ...ellipsisMixin()
                }}
              >
                {credential.attestation.claimHash}
              </Typography>
            </Tooltip>
          </Box>
        </Stack>
      </Paper>

      <Stack
        direction="row"
        spacing={1}
        sx={({ transitions }) => ({
          position: 'absolute',
          bottom: 32,
          right: 32,
          opacity: enter ? 1 : 0,

          transition: transitions.create(['opacity'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.enteringScreen
          }),

          '.MuiButtonBase-root': {
            background: '#fff',
            border: '1px solid #C5C5DE',
            borderRadius: '10px'
          }
        })}
        textAlign="center"
      >
        <IconButton>
          <IconDownload />
        </IconButton>
        <IconButton>
          <IconForward />
        </IconButton>
      </Stack>
      <Box
        sx={({ palette, spacing }) => ({
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          height: '60%',
          margin: 'auto',
          borderTopRightRadius: spacing(1),
          borderBottomRightRadius: spacing(1),
          background: verified
            ? palette.success.main
            : credential.attestation.revoked
            ? palette.error.main
            : palette.warning.main
        })}
      />
    </Box>
  );
};

export default React.memo(CredentialCell);
