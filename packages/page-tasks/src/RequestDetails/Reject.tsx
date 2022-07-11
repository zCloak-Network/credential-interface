import type { IEncryptedMessage, IMessage } from '@kiltprotocol/types';

import type { Request } from '@credential/react-hooks/types';

import { Message } from '@kiltprotocol/sdk-js';
import { alpha, Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { credentialDb } from '@credential/app-db';
import { Recaptcha } from '@credential/react-components';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { encryptMessage, sendMessage, Steps } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

import IconReject from '../icons/icon_reject.svg';

const Reject: React.FC<{
  type?: 'button' | 'menu';
  request: Request;
  messageLinked?: IMessage[];
}> = ({ messageLinked, request, type = 'button' }) => {
  const { keyring } = useKeystore();
  const [open, toggleOpen] = useToggle();
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

  const message = useMemo(() => {
    if (!didUri) {
      return null;
    }

    const message = new Message(
      {
        content: request.rootHash,
        type: Message.BodyType.REJECT_ATTESTATION
      },
      didUri,
      request.claim.owner
    );

    message.references = messageLinked?.map((message) => message.messageId);

    return message;
  }, [didUri, messageLinked, request.claim.owner, request.rootHash]);
  const claimer = useDidDetails(request.claim.owner);

  const onDone = useCallback(() => {
    if (message) {
      credentialDb.message.add({ ...message, deal: 0, isRead: 1 });
    }

    toggleOpen();
  }, [message, toggleOpen]);

  return (
    <>
      {type === 'button' ? (
        <Button
          onClick={toggleOpen}
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
        <MenuItem onClick={toggleOpen} sx={({ palette }) => ({ color: palette.error.main })}>
          <ListItemIcon sx={{ minWidth: '0px !important', marginRight: 1 }}>
            <IconReject />
          </ListItemIcon>
          <ListItemText>Reject</ListItemText>
        </MenuItem>
      )}
      <DidsModal
        onClose={toggleOpen}
        open={open}
        steps={
          <Steps
            onDone={onDone}
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
                exec: () => sendMessage(encryptedMessage, recaptchaToken)
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
