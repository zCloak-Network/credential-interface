import type { IMessage } from '@kiltprotocol/types';

import { Attestation, Did, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { alpha, Button } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { RequestForAttestation } from '@credential/app-db/requestForAttestation';
import { AppContext } from '@credential/react-components';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { EncryptMessageStep, ExtrinsicStep, SendMessageStep } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

const Approve: React.FC<{
  request: RequestForAttestation;
  messageLinked?: IMessage[];
}> = ({ messageLinked, request }) => {
  const [open, toggleOpen] = useToggle();
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const { keyring } = useKeystore();
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const { parseMessageBody } = useContext(AppContext);

  const attestation = useMemo(
    () => (didUri ? Attestation.fromRequestAndDid(request, didUri) : null),
    [didUri, request]
  );

  const getExtrinsic = useCallback(async () => {
    if (!attestation) {
      throw new Error('no attestation found');
    }

    if (!(attester instanceof Did.FullDidDetails)) {
      throw new Error('The DID with the given identifier is not on chain.');
    }

    const tx = await attestation.getStoreTx();
    const extrinsic = await attester.authorizeExtrinsic(tx, keyring, attester.identifier);

    return extrinsic;
  }, [attestation, attester, keyring]);

  const message = useMemo(() => {
    if (!didUri) {
      return null;
    }

    if (!attestation) {
      return null;
    }

    const message = new Message(
      {
        content: { attestation },
        type: Message.BodyType.SUBMIT_ATTESTATION
      },
      didUri,
      request.claim.owner
    );

    message.references = messageLinked?.map((message) => message.messageId);

    return message;
  }, [attestation, didUri, messageLinked, request.claim.owner]);

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
          background: alpha(palette.success.main, 0.1),
          borderColor: palette.success.main,
          color: palette.success.main,
          ':hover': {
            borderColor: palette.success.main
          }
        })}
        variant="outlined"
      >
        Approve
      </Button>
      <DidsModal
        onClose={toggleOpen}
        onDone={onDone}
        open={open}
        steps={(prevStep, nextStep, reportError, reportStatus) => [
          {
            label: 'Sign and submit attestation',
            content: (
              <ExtrinsicStep
                getExtrinsic={getExtrinsic}
                isFirst
                nextStep={nextStep}
                prevStep={prevStep}
                reportError={reportError}
                reportStatus={reportStatus}
                sender={attester?.authenticationKey.publicKey}
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
        title="Approve the request"
      />
    </>
  );
};

export default React.memo(Approve);
