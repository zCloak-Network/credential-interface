import { Did, ICredential, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { IconForward } from '@credential/app-config/icons';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { EncryptMessageStep, InputDidStep, SendMessageStep } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';

const ShareButton: React.FC<{ credential: ICredential; withText?: boolean }> = ({
  credential,
  withText = false
}) => {
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
        steps={(prevStep, nextStep, reportError, reportStatus) => [
          {
            label: 'Input receiver',
            content: (
              <InputDidStep
                isFirst
                nextStep={nextStep}
                onChange={setReceiver}
                prevStep={prevStep}
                reportError={reportError}
                reportStatus={reportStatus}
              />
            )
          },
          {
            label: 'Encrypt message',
            content: (
              <EncryptMessageStep
                handleEncrypted={setEncryptedMessage}
                message={message}
                nextStep={nextStep}
                prevStep={prevStep}
                receiver={receiver}
                reportError={reportError}
                reportStatus={reportStatus}
                sender={sender}
              />
            )
          },
          {
            label: 'Send and save message',
            content: (
              <SendMessageStep
                encryptedMessage={encryptedMessage}
                isLast
                message={message}
                nextStep={nextStep}
                prevStep={prevStep}
                reportError={reportError}
                reportStatus={reportStatus}
              />
            )
          }
        ]}
        title="Share this with others"
      />
    </>
  );
};

export default React.memo(ShareButton);
