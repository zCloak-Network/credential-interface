import {
  Hash,
  IRejectAttestation,
  IRequestAttestation,
  ISubmitAttestation,
  ISubmitCredential,
  MessageBodyType
} from '@kiltprotocol/sdk-js';
import Circle from '@mui/icons-material/Circle';
import { alpha, Box, Button, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconNewMessage, IconNewTask } from '@credential/app-config/icons';
import { Message } from '@credential/app-db/message';
import { CredentialModal, CTypeName } from '@credential/react-components';
import { DidName } from '@credential/react-dids';
import { useCredential, useToggle } from '@credential/react-hooks';

function Cell({
  message: { body, createdAt, isRead, sender },
  onRead
}: {
  message: Message<
    IRejectAttestation | IRequestAttestation | ISubmitAttestation | ISubmitCredential
  >;
  onRead: () => void;
}) {
  const navigate = useNavigate();
  const rootHash = useMemo((): Hash | null => {
    return body.type === MessageBodyType.SUBMIT_ATTESTATION
      ? body.content.attestation.claimHash
      : body.type === MessageBodyType.REQUEST_ATTESTATION
      ? body.content.requestForAttestation.rootHash
      : body.type === MessageBodyType.REJECT_ATTESTATION
      ? body.content
      : null;
  }, [body.content, body.type]);
  const localCredential = useCredential(rootHash);

  const credential = useMemo(
    () => (body.type === MessageBodyType.SUBMIT_CREDENTIAL ? body.content[0] : localCredential),
    [body.content, body.type, localCredential]
  );

  const [open, toggleOpen] = useToggle();

  const desc = useMemo(() => {
    if (body.type === MessageBodyType.REQUEST_ATTESTATION) {
      return (
        <>
          <Box component="span" sx={({ palette }) => ({ color: palette.primary.main })}>
            <DidName value={sender} />
          </Box>{' '}
          submitted{' '}
          <Box component="span" sx={({ palette }) => ({ color: palette.primary.main })}>
            <CTypeName cTypeHash={body.content.requestForAttestation.claim.cTypeHash} />
          </Box>{' '}
          verification request, Please deal with it in time!
        </>
      );
    } else if (body.type === MessageBodyType.SUBMIT_CREDENTIAL) {
      return 'You are have received a new credential, Please check in time!';
    } else if (body.type === MessageBodyType.SUBMIT_ATTESTATION) {
      return (
        <>
          <Box component="span" sx={({ palette }) => ({ color: palette.primary.main })}>
            <DidName value={sender} />
          </Box>{' '}
          submit{' '}
          <Box component="span" sx={({ palette }) => ({ color: palette.primary.main })}>
            <CTypeName cTypeHash={body.content.attestation.cTypeHash} />
          </Box>{' '}
          attestation
        </>
      );
    } else {
      return (
        <>
          <Box component="span" sx={({ palette }) => ({ color: palette.primary.main })}>
            <DidName value={sender} />
          </Box>{' '}
          reject attestation
        </>
      );
    }
  }, [body, sender]);

  const handleClick = useCallback(() => {
    onRead();

    if (body.type === MessageBodyType.SUBMIT_CREDENTIAL && credential) {
      toggleOpen();
    } else if (body.type === MessageBodyType.REQUEST_ATTESTATION) {
      navigate(`/attester/tasks/${body.content.requestForAttestation.rootHash}`);
    }
  }, [body, credential, navigate, onRead, toggleOpen]);

  return (
    <>
      <Stack
        alignItems="flex-start"
        direction="row"
        justifyContent="space-between"
        onClick={handleClick}
        paddingX={2}
        paddingY={1.5}
        spacing={2.5}
        sx={({ palette }) => ({
          ':hover': {
            background: alpha(palette.primary.main, 0.1)
          }
        })}
        width={532}
      >
        <Box sx={{ width: 24, display: 'flex', alignSelf: 'center', flex: '0 0 auto' }}>
          {body.type === MessageBodyType.REQUEST_ATTESTATION ? <IconNewTask /> : <IconNewMessage />}
        </Box>
        <Box sx={{ width: 336 }}>
          <Typography variant="inherit">{desc}</Typography>
        </Box>
        <Box sx={{ width: 140, textAlign: 'right', whiteSpace: 'nowrap' }}>
          <Stack alignItems="center" direction="row" spacing={1.5}>
            <Typography
              sx={({ palette }) => ({
                color: palette.grey[500],
                fontSize: 12
              })}
              variant="inherit"
            >
              {moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>
            <Circle color={isRead ? 'disabled' : 'warning'} sx={{ width: 8, height: 8 }} />
          </Stack>
          {!isRead && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRead();
              }}
              sx={{
                fontSize: 12
              }}
            >
              Mask as read
            </Button>
          )}
        </Box>
      </Stack>
      {open && credential && <CredentialModal credential={credential} onClose={toggleOpen} />}
    </>
  );
}

export default React.memo(Cell);
