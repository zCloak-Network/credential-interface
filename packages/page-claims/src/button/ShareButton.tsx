import { Did, ICredential, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { IconButton, lighten, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { IconForward } from '@credential/app-config/icons';
import { Recaptcha } from '@credential/react-components';
import { DidsContext, DidsModal, InputDid, useDidDetails } from '@credential/react-dids';
import { encryptMessage, sendMessage, Steps } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

const ShareButton: React.FC<{ credential: ICredential; withText?: boolean }> = ({
  credential,
  withText = false
}) => {
  const { keyring } = useKeystore();
  const { didUri } = useContext(DidsContext);
  const [open, toggleOpen] = useToggle();
  const [receiver, setReceiver] = useState<Did.FullDidDetails | null>(null);
  const sender = useDidDetails(didUri);
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

  const _toggleOpen: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      toggleOpen();
    },
    [toggleOpen]
  );

  const message = useMemo(
    () =>
      sender && receiver
        ? new Message(
            {
              content: [credential],
              type: Message.BodyType.SUBMIT_CREDENTIAL
            },
            sender.uri,
            receiver.uri
          )
        : null,
    [credential, receiver, sender]
  );

  const onDone = useCallback(() => {
    if (message) {
      endpoint.db.messages.put({ ...message, deal: 0, isRead: 1 }, ['messageId']);
    }

    toggleOpen();
  }, [message, toggleOpen]);

  return (
    <>
      <Tooltip title="Share to other">
        <Stack alignItems="center">
          <IconButton onClick={_toggleOpen}>
            <IconForward />
          </IconButton>
          {withText && (
            <Typography sx={({ palette }) => ({ color: palette.common.white })} variant="inherit">
              Share
            </Typography>
          )}
        </Stack>
      </Tooltip>
      <DidsModal
        onClose={toggleOpen}
        open={open}
        steps={
          receiver ? (
            <Steps
              onDone={onDone}
              steps={[
                {
                  label: 'Encrypt message',
                  exec: () =>
                    encryptMessage(keyring, message, sender, receiver).then(setEncryptedMessage)
                },
                {
                  label: 'Send message',
                  paused: true,
                  content: <Recaptcha onCallback={setRecaptchaToken} />,
                  exec: () => sendMessage(encryptedMessage, recaptchaToken)
                }
              ]}
              submitText="Share"
            />
          ) : null
        }
        title="Share this with others"
      >
        <InputDid
          inputProps={{
            sx: ({ palette }) => ({
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent'
              },
              border: 'none',
              background: lighten(palette.primary.main, 0.94)
            })
          }}
          onChange={setReceiver}
        />
      </DidsModal>
    </>
  );
};

export default React.memo(ShareButton);
