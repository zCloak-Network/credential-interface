import type { IEncryptedMessage, IMessage } from '@kiltprotocol/types';

import type { Request } from '@credential/react-hooks/types';

import { Message } from '@kiltprotocol/sdk-js';
import { alpha, Button } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { AppContext } from '@credential/react-components';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { EncryptMessageStep, SendMessageStep } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';

const Reject: React.FC<{
  request: Request;
  messageLinked?: IMessage[];
}> = ({ messageLinked, request }) => {
  const [open, toggleOpen] = useToggle();
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const { parseMessageBody } = useContext(AppContext);

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
    parseMessageBody();
    toggleOpen();
  }, [parseMessageBody, toggleOpen]);

  return (
    <>
      <Button
        onClick={toggleOpen}
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
      <DidsModal
        onClose={toggleOpen}
        onDone={onDone}
        open={open}
        steps={(prevStep, nextStep, reportError, reportStatus) => [
          {
            label: 'Encrypt message',
            content: (
              <EncryptMessageStep
                handleEncrypted={setEncryptedMessage}
                message={message}
                nextStep={nextStep}
                prevStep={prevStep}
                receiver={claimer}
                reportError={reportError}
                reportStatus={reportStatus}
                sender={attester}
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
        title="Reject the request"
      />
    </>
  );
};

export default React.memo(Reject);
