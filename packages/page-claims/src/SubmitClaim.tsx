import {
  CType,
  Did,
  IEncryptedMessage,
  Message,
  RequestForAttestation
} from '@kiltprotocol/sdk-js';
import { Button } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { credentialDb } from '@credential/app-db';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import {
  EncryptMessageStep,
  RequestAttestationStep,
  SendMessageStep
} from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';

const SubmitClaim: React.FC<{
  contents: Record<string, unknown>;
  attester: Did.FullDidDetails | null;
  ctype?: CType;
  onDone?: () => void;
}> = ({ attester, contents, ctype, onDone }) => {
  const { didUri } = useContext(DidsContext);
  const [open, toggleOpen] = useToggle();
  const sender = useDidDetails(didUri);
  const [request, setRequest] = useState<RequestForAttestation>();
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();

  const message = useMemo(
    () =>
      sender && attester && request
        ? new Message(
            {
              content: { requestForAttestation: request },
              type: Message.BodyType.REQUEST_ATTESTATION
            },
            sender.uri,
            attester.uri
          )
        : null,
    [attester, request, sender]
  );

  const _onDone = useCallback(() => {
    if (message) {
      credentialDb.message.add({ ...message, deal: 0, isRead: 1 });
    }

    onDone?.();
  }, [message, onDone]);

  return (
    <>
      <Button onClick={toggleOpen} variant="contained">
        Submit
      </Button>
      <DidsModal
        autoExec
        onClose={toggleOpen}
        onDone={_onDone}
        open={open}
        steps={(prevStep, nextStep, reportError, reportStatus, execFunc) => [
          {
            label: 'Request for attestation and sign',
            content: (
              <RequestAttestationStep
                contents={contents as Record<string, any>}
                ctype={ctype}
                execFunc={execFunc}
                handleRequest={setRequest}
                isFirst
                nextStep={nextStep}
                prevStep={prevStep}
                reportError={reportError}
                reportStatus={reportStatus}
                sender={sender}
                step={0}
              />
            )
          },
          {
            label: 'Encrypt message',
            content: (
              <EncryptMessageStep
                execFunc={execFunc}
                handleEncrypted={setEncryptedMessage}
                message={message}
                nextStep={nextStep}
                prevStep={prevStep}
                receiver={attester}
                reportError={reportError}
                reportStatus={reportStatus}
                sender={sender}
                step={1}
              />
            )
          },
          {
            label: 'Send message',
            content: (
              <SendMessageStep
                encryptedMessage={encryptedMessage}
                execFunc={execFunc}
                isLast
                message={message}
                nextStep={nextStep}
                prevStep={prevStep}
                reportError={reportError}
                reportStatus={reportStatus}
                step={2}
              />
            )
          }
        ]}
        title="Submit claim"
      />
    </>
  );
};

export default React.memo(SubmitClaim);
