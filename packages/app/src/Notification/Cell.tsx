import { Hash, IRequestAttestation, MessageBody, MessageBodyType } from '@kiltprotocol/sdk-js';
import Circle from '@mui/icons-material/Circle';
import { alpha, Box, Button, Link, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconNewMessage, IconNewTask } from '@credential/app-config/icons';
import { Message } from '@credential/app-db/message';
import { CredentialModal, CTypeName } from '@credential/react-components';
import { DidName } from '@credential/react-dids';
import { useCredential, useReferenceMessages, useToggle } from '@credential/react-hooks';

function Cell({
  message: { body, createdAt, isRead, references, sender },
  onRead
}: {
  message: Message<MessageBody>;
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

  const referenceMessages = useReferenceMessages(references);

  const [open, toggleOpen] = useToggle();

  const desc = useMemo(() => {
    if (body.type === MessageBodyType.REQUEST_ATTESTATION) {
      return (
        <>
          <Link>
            <DidName value={sender} />
          </Link>{' '}
          submitted{' '}
          <Link>
            <CTypeName cTypeHash={body.content.requestForAttestation.claim.cTypeHash} />
          </Link>{' '}
          verification request, Please deal with it in time!
        </>
      );
    } else if (body.type === MessageBodyType.SUBMIT_CREDENTIAL) {
      return 'You are have received a new credential, Please check in time!';
    } else if (body.type === MessageBodyType.SUBMIT_ATTESTATION) {
      return (
        <>
          <Link>
            <DidName value={sender} />
          </Link>{' '}
          approved{' '}
          <Link>
            <CTypeName cTypeHash={body.content.attestation.cTypeHash} />
          </Link>{' '}
          attestation
        </>
      );
    } else if (body.type === MessageBodyType.REJECT_ATTESTATION) {
      const requestMessage = referenceMessages.find<Message<IRequestAttestation>>(
        (message): message is Message<IRequestAttestation> =>
          message.body.type === MessageBodyType.REQUEST_ATTESTATION
      );

      return (
        <>
          <Link>
            <DidName value={sender} />
          </Link>{' '}
          rejected{' '}
          {requestMessage ? (
            <Link>
              <CTypeName
                cTypeHash={requestMessage.body.content.requestForAttestation.claim.cTypeHash}
              />
            </Link>
          ) : (
            ''
          )}{' '}
          attestation
        </>
      );
    } else if (body.type === MessageBodyType.ACCEPT_CREDENTIAL) {
      return (
        <>
          Verifier{' '}
          <Link>
            <DidName value={sender} />
          </Link>{' '}
          accepted <CTypeName cTypeHash={body.content[0]} /> credential type.
        </>
      );
    } else if (body.type === MessageBodyType.REJECT_CREDENTIAL) {
      return (
        <>
          Verifier{' '}
          <Link>
            <DidName value={sender} />
          </Link>{' '}
          rejected{' '}
          <Link>
            <CTypeName cTypeHash={body.content[0]} />
          </Link>{' '}
          credential type.
        </>
      );
    }

    return (
      <>
        Unknown type from{' '}
        <Link>
          <DidName value={sender} />
        </Link>
      </>
    );
  }, [body.content, body.type, referenceMessages, sender]);

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
