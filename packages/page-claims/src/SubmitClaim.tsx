import {
  CType,
  Did,
  IEncryptedMessage,
  Message,
  RequestForAttestation
} from '@kiltprotocol/sdk-js';
import { Button } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { Recaptcha } from '@credential/react-components';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import {
  encryptMessage,
  requestAttestation,
  sendMessage,
  Steps
} from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

const SubmitClaim: React.FC<{
  contents: Record<string, unknown>;
  attester: Did.FullDidDetails | null;
  ctype?: CType;
  onDone?: () => void;
}> = ({ attester, contents, ctype, onDone }) => {
  const { keyring } = useKeystore();
  const { didUri } = useContext(DidsContext);
  const [open, toggleOpen] = useToggle();
  const sender = useDidDetails(didUri);
  const [request, setRequest] = useState<RequestForAttestation>();
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

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
      endpoint.db.message.put({ ...message, deal: 0, isRead: 1 }, ['messageId']);
    }

    onDone?.();
  }, [message, onDone]);

  return (
    <>
      <Button onClick={toggleOpen} variant="contained">
        Submit
      </Button>
      <DidsModal
        onClose={toggleOpen}
        open={open}
        steps={
          <Steps
            onDone={_onDone}
            steps={[
              {
                label: 'Request for attestation and sign',
                exec: () =>
                  requestAttestation(keyring, sender, ctype, contents as Record<string, any>).then(
                    setRequest
                  )
              },
              {
                label: 'Encrypt message',
                exec: () =>
                  encryptMessage(keyring, message, sender, attester).then(setEncryptedMessage)
              },
              {
                label: 'Send message',
                paused: true,
                content: <Recaptcha onCallback={setRecaptchaToken} />,
                exec: () => sendMessage(encryptedMessage, recaptchaToken)
              }
            ]}
            submitText="Submit claim"
          />
        }
        title="Submit claim"
      />
    </>
  );
};

export default React.memo(SubmitClaim);
