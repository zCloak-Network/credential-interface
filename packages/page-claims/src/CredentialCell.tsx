import type { CredentialType } from '@credential/react-components/CredentialProvider/types';

import { Credential, CType } from '@kiltprotocol/sdk-js';
import { Box, Paper, Stack, styled, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import React, { useContext, useMemo } from 'react';

import { CTypeContext } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';

import DownloadButton from './button/DownloadButton';
import ImportButton from './button/ImportButton';
import ShareButton from './button/ShareButton';
import Status from './Status';

const Wrapper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  height: 211,
  borderRadius: theme.spacing(2.5),
  overflow: 'hidden',
  ':hover': {
    boxShadow: theme.shadows[3],

    '.CredentialCell_Status': {},

    '.CredentialCell_title': {
      transform: 'translate(90px, -40px)',
      fontSize: 18
    },
    '.CredentialCell_attester': {
      transform: 'translate(0, -30px)'
    },
    '.CredentialCell_actions': {
      opacity: 1,
      transform: 'translateY(0)'
    },
    '.CredentialCell_Time': {
      opacity: 0
    }
  },
  '.CredentialCell_Status': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  '.CredentialCell_Time': {
    color: theme.palette.grey[500]
  },
  '.CredentialCell_title': {
    transformOrigin: 'top left',
    ...ellipsisMixin(),

    transition: theme.transitions.create(['transform', 'font-size'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  '.CredentialCell_attester': {
    transformOrigin: 'top left',

    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  '.CredentialCell_actions': {
    left: theme.spacing(4),
    right: theme.spacing(4),
    bottom: theme.spacing(4),
    opacity: 0,
    position: 'absolute',
    transform: 'translateY(20px)',
    textAlign: 'right',

    '.MuiButtonBase-root': {
      border: `1px solid ${theme.palette.grey[400]}`,
      borderRadius: `${theme.spacing(1.25)}`
    },

    transition: theme.transitions.create(['transform', 'opacity'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}));

const CredentialCell: React.FC<{ item: CredentialType }> = ({
  item: { credential: iCredential, hash, revoked, timestamp, verified }
}) => {
  const { cTypeList } = useContext(CTypeContext);
  const credential = useMemo(() => Credential.fromCredential(iCredential), [iCredential]);
  const cType = useMemo(() => {
    return cTypeList.find(
      (cType) =>
        CType.fromSchema(cType.schema, cType.owner).hash === credential.attestation.cTypeHash
    );
  }, [cTypeList, credential.attestation.cTypeHash]);

  return (
    <Box position="relative">
      <Box
        sx={({ palette }) => ({
          zIndex: 1,
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          height: '60%',
          margin: 'auto',
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
          background: verified
            ? palette.success.main
            : revoked
            ? palette.error.main
            : palette.warning.main
        })}
      />
      <Wrapper>
        <Box className="CredentialCell_Status">
          <Status revoked={revoked} verified={verified} />
          <Typography className="CredentialCell_Time" variant="inherit">
            {moment(timestamp).format('YYYY:MM:DD HH:mm:ss')}
          </Typography>
        </Box>
        <Tooltip title={cType?.schema.title ?? 'Unknown CType'}>
          <Typography className="CredentialCell_title" mt={2} variant="h3">
            {cType?.schema.title || credential.attestation.cTypeHash}
          </Typography>
        </Tooltip>
        <Stack
          className="CredentialCell_attester"
          direction="row"
          justifyContent="space-between"
          mt={2}
          spacing={1}
        >
          <Box width="50%">
            <Typography sx={({ palette }) => ({ color: palette.grey[500] })} variant="inherit">
              Attested by
            </Typography>
            <Tooltip placement="top" title={cType?.owner ?? 'Unknown CType'}>
              <Typography sx={{ fontWeight: 500, ...ellipsisMixin() }}>
                {cType?.owner ?? '--'}
              </Typography>
            </Tooltip>
          </Box>
          <Box width="50%">
            <Typography sx={({ palette }) => ({ color: palette.grey[500] })} variant="inherit">
              Claim hash
            </Typography>
            <Tooltip placement="top" title={hash}>
              <Typography sx={{ fontWeight: 500, ...ellipsisMixin() }}>{hash}</Typography>
            </Tooltip>
          </Box>
        </Stack>
        <Stack className="CredentialCell_actions" direction="row-reverse" mt={2} spacing={1}>
          <ImportButton />
          <ShareButton credential={credential} />
          <DownloadButton credential={credential} />
        </Stack>
      </Wrapper>
    </Box>
  );
};

export default React.memo(CredentialCell);
