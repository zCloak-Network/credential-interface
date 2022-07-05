import {
  CType,
  Did,
  IEncryptedMessage,
  Message,
  RequestForAttestation
} from '@kiltprotocol/sdk-js';
import { Button } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

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

  return (
    <>
      <Button onClick={toggleOpen} variant="contained">
        Submit
      </Button>
      <DidsModal
        onClose={toggleOpen}
        onDone={onDone}
        open={open}
        steps={(prevStep, nextStep, reportError, reportStatus) => [
          {
            label: 'Request for attestation and sign',
            content: (
              <RequestAttestationStep
                contents={contents as Record<string, any>}
                ctype={ctype}
                handleRequest={setRequest}
                isFirst
                nextStep={nextStep}
                prevStep={prevStep}
                reportError={reportError}
                reportStatus={reportStatus}
                sender={sender}
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
                receiver={attester}
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

export default React.memo(SubmitClaim);
