import { CType, IAttestation, IRequestAttestation } from '@kiltprotocol/sdk-js';
import { alpha, Box, Paper, Stack, styled, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import React, { useContext, useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import {
  CredentialModal,
  CredentialStatus,
  CTypeContext,
  CTypeName
} from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useRequestStatus, useToggle } from '@credential/react-hooks';
import { RequestStatus } from '@credential/react-hooks/types';

import DownloadButton from './button/DownloadButton';
import ImportButton from './button/ImportButton';
import ShareButton from './button/ShareButton';

const Wrapper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  height: 211,
  borderRadius: theme.spacing(2.5),
  overflow: 'hidden',
  cursor: 'pointer',

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
    right: theme.spacing(4),
    bottom: theme.spacing(4),
    opacity: 0,
    position: 'absolute',
    transform: 'translateY(20px)',
    textAlign: 'right',

    '.MuiButtonBase-root': {
      border: `1px solid ${theme.palette.grey[300]}`,
      borderRadius: `${theme.spacing(1.25)}`
    },

    transition: theme.transitions.create(['transform', 'opacity'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}));

const CredentialCell: React.FC<{
  request: Message<IRequestAttestation>;
  attestation?: IAttestation | null;
}> = ({ attestation, request }) => {
  const [open, toggleOpen] = useToggle();
  const { cTypeList } = useContext(CTypeContext);
  const cType = useMemo(() => {
    return cTypeList.find(
      (cType) =>
        CType.fromSchema(cType.schema, cType.owner).hash ===
        request.body.content.requestForAttestation.claim.cTypeHash
    );
  }, [cTypeList, request.body.content.requestForAttestation.claim.cTypeHash]);

  const credential = useMemo(
    () =>
      attestation ? { attestation, request: request.body.content.requestForAttestation } : null,
    [attestation, request]
  );

  const requestStatus = useRequestStatus(request.body.content.requestForAttestation.rootHash);

  return (
    <>
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
            background:
              requestStatus === RequestStatus.SUBMIT
                ? attestation?.revoked
                  ? palette.error.main
                  : palette.success.main
                : requestStatus === RequestStatus.REJECT
                ? palette.error.main
                : palette.warning.main
          })}
        />
        <Wrapper onClick={toggleOpen}>
          <Box className="CredentialCell_Status">
            <CredentialStatus
              revoked={attestation?.revoked}
              role="claimer"
              showText
              status={requestStatus}
            />
            <Typography className="CredentialCell_Time" variant="inherit">
              {moment(request.createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>
          </Box>
          <Typography className="CredentialCell_title" mt={2} variant="h3">
            <CTypeName cTypeHash={request.body.content.requestForAttestation.claim.cTypeHash} />
          </Typography>
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
                  <DidName value={attestation?.owner ?? request.receiver} />
                </Typography>
              </Tooltip>
            </Box>
            <Box width="50%">
              <Typography sx={({ palette }) => ({ color: palette.grey[500] })} variant="inherit">
                Claim hash
              </Typography>
              <Tooltip placement="top" title={request.body.content.requestForAttestation.rootHash}>
                <Typography sx={{ fontWeight: 500, ...ellipsisMixin() }}>
                  {request.body.content.requestForAttestation.rootHash}
                </Typography>
              </Tooltip>
            </Box>
          </Stack>
          {credential && (
            <Stack
              className="CredentialCell_actions"
              direction="row-reverse"
              display="inline-flex"
              mt={2}
              onClick={(e) => e.stopPropagation()}
              spacing={1}
            >
              <ImportButton credential={credential} />
              <ShareButton credential={credential} />
              <DownloadButton credential={credential} />
            </Stack>
          )}
        </Wrapper>
      </Box>
      {cType && credential && open && (
        <CredentialModal
          actions={
            <Stack
              alignItems="center"
              spacing={2}
              sx={({ palette }) => ({
                '.MuiButtonBase-root': {
                  width: 44,
                  height: 44,
                  background: palette.common.white,
                  border: '1px solid',
                  borderColor: alpha(palette.primary.main, 0.38),
                  borderRadius: 2.5
                }
              })}
            >
              <ShareButton credential={credential} withText />
              <ImportButton credential={credential} withText />
              <DownloadButton credential={credential} withText />
            </Stack>
          }
          credential={credential}
          onClose={toggleOpen}
        />
      )}
    </>
  );
};

export default React.memo(CredentialCell);
