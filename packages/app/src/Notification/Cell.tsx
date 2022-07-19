import { DidUri, MessageBody, MessageBodyType } from '@kiltprotocol/sdk-js';
import Circle from '@mui/icons-material/Circle';
import { alpha, Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';

import { IconNewMessage, IconNewTask } from '@credential/app-config/icons';
import { CredentialModal, CTypeName } from '@credential/react-components';
import { DidName } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

interface Props {
  sender: DidUri;
  receiver: DidUri;
  body: MessageBody;
  time: number;
  isRead: boolean;
  onRead: () => void;
}

const Cell: React.FC<Props> = ({ body, isRead, onRead, sender, time }) => {
  const credential = useMemo(
    () => (body.type === MessageBodyType.SUBMIT_CREDENTIAL ? body.content[0] : null),
    [body.content, body.type]
  );

  const [open, toggleOpen] = useToggle();

  const desc = useMemo(() => {
    if (body.type === MessageBodyType.REQUEST_ATTESTATION) {
      return (
        <>
          <Box component="span" sx={({ palette }) => ({ color: palette.primary.main })}>
            <DidName value={sender} />
          </Box>{' '}
          submitted
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
    } else if (body.type === MessageBodyType.REJECT_ATTESTATION) {
      return (
        <>
          <Box component="span" sx={({ palette }) => ({ color: palette.primary.main })}>
            <DidName value={sender} />
          </Box>{' '}
          reject attestation
        </>
      );
    } else {
      return body.type;
    }
  }, [body, sender]);

  const handleClick = useCallback(() => {
    if (body.type === MessageBodyType.SUBMIT_CREDENTIAL && credential) {
      toggleOpen();
      onRead();
    }
  }, [body.type, credential, onRead, toggleOpen]);

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
              {moment(time).format('YYYY-MM-DD HH:mm:ss')}
            </Typography>
            <Circle color={isRead ? 'disabled' : 'warning'} sx={{ width: 8, height: 8 }} />
          </Stack>
          {!isRead && (
            <Box
              onClick={onRead}
              sx={({ palette }) => ({
                fontSize: 12,
                color: palette.primary.main,
                cursor: 'pointer',
                marginTop: 1
              })}
            >
              Mask as read
            </Box>
          )}
        </Box>
      </Stack>
      {open && credential && <CredentialModal credential={credential} onClose={toggleOpen} />}
    </>
  );
};

export default React.memo(Cell);
