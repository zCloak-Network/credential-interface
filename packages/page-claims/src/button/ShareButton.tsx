import { Did, ICredential, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { IconForward } from '@credential/app-config/icons';
import { credentialDb } from '@credential/app-db';
import { DidsContext, DidsModal, InputDid, useDidDetails } from '@credential/react-dids';
import { encryptMessage, sendMessage } from '@credential/react-dids/steps';
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
      credentialDb.message.add({ ...message, deal: 0, isRead: 1 });
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
        onDone={onDone}
        open={open}
        steps={
          receiver
            ? [
                {
                  label: 'Encrypt message',
                  exec: () =>
                    encryptMessage(keyring, message, sender, receiver).then(setEncryptedMessage)
                },
                {
                  label: 'Send message',
                  exec: () => sendMessage(encryptedMessage)
                }
              ]
            : undefined
        }
        submitText="Share"
        title="Share this with others"
      >
        <InputDid onChange={setReceiver} />
      </DidsModal>
    </>
  );
};

export default React.memo(ShareButton);
