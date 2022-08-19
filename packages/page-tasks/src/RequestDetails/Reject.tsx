import type { IEncryptedMessage, IMessage, IRequestAttestation } from '@kiltprotocol/types';

import { Message as MessageKilt } from '@kiltprotocol/sdk-js';
import { alpha, Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

import { Message } from '@credential/app-db/message';
import { AppContext, Recaptcha } from '@credential/react-components';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { encryptMessage, sendMessage, Steps } from '@credential/react-dids/steps';
import { useStopPropagation, useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

import IconReject from '../icons/icon_reject.svg';

const Reject: React.FC<{
  type?: 'button' | 'menu';
  request: Message<IRequestAttestation>;
  messageLinked?: IMessage[];
}> = ({ messageLinked, request, type = 'button' }) => {
  const { keyring } = useKeystore();
  const [open, toggleOpen] = useToggle();
  const { fetcher } = useContext(AppContext);
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

  const message = useMemo(() => {
    if (!didUri) {
      return null;
    }

    const message = new MessageKilt(
      {
        content: request.body.content.requestForAttestation.rootHash,
        type: MessageKilt.BodyType.REJECT_ATTESTATION
      },
      didUri,
      request.body.content.requestForAttestation.claim.owner
    );

    message.references = messageLinked?.map((message) => message.messageId);

    return message;
  }, [
    didUri,
    messageLinked,
    request.body.content.requestForAttestation.claim.owner,
    request.body.content.requestForAttestation.rootHash
  ]);
  const claimer = useDidDetails(request.body.content.requestForAttestation.claim.owner);
  const _toggleOpen = useStopPropagation(toggleOpen);

  return (
    <>
      {type === 'button' ? (
        <Button
          onClick={_toggleOpen}
          startIcon={<IconReject />}
          sx={({ palette }) => ({
            background: alpha(palette.error.main, 0),
            borderColor: palette.error.main,
            color: palette.error.main,
            ':hover': {
              borderColor: palette.error.main
            }
          })}
          variant="outlined"
        >
          Reject
        </Button>
      ) : (
        <MenuItem onClick={_toggleOpen} sx={({ palette }) => ({ color: palette.error.main })}>
          <ListItemIcon sx={{ minWidth: '0px !important', marginRight: 1 }}>
            <IconReject />
          </ListItemIcon>
          <ListItemText>Reject</ListItemText>
        </MenuItem>
      )}
      <DidsModal
        onClose={_toggleOpen}
        open={open}
        steps={
          <Steps
            onDone={_toggleOpen}
            steps={[
              {
                label: 'Encrypt message',
                exec: () =>
                  encryptMessage(keyring, message, attester, claimer).then(setEncryptedMessage)
              },
              {
                label: 'Send message',
                paused: true,
                content: <Recaptcha onCallback={setRecaptchaToken} />,
                exec: () => sendMessage(fetcher, encryptedMessage, recaptchaToken, message)
              }
            ]}
            submitText="Reject"
          />
        }
        title="Reject the request"
      />
    </>
  );
};

export default React.memo(Reject);
