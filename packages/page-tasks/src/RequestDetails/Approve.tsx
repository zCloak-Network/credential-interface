import type { IMessage } from '@kiltprotocol/types';

import type { Request } from '@credential/react-hooks/types';

import { Attestation, Did, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { alpha, Button } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { credentialDb } from '@credential/app-db';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { EncryptMessageStep, ExtrinsicStep, SendMessageStep } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

const Approve: React.FC<{
  request: Request;
  messageLinked?: IMessage[];
}> = ({ messageLinked, request }) => {
  const [open, toggleOpen] = useToggle();
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const { keyring } = useKeystore();
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();

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
    if (message) {
      credentialDb.message.add({ ...message, deal: 0, isRead: 1 });
    }

    toggleOpen();
  }, [message, toggleOpen]);

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
        autoExec
        onClose={toggleOpen}
        onDone={onDone}
        open={open}
        steps={(prevStep, nextStep, reportError, reportStatus, execFunc) => [
          {
            label: 'Sign and submit attestation',
            content: (
              <ExtrinsicStep
                execFunc={execFunc}
                getExtrinsic={getExtrinsic}
                isFirst
                nextStep={nextStep}
                prevStep={prevStep}
                reportError={reportError}
                reportStatus={reportStatus}
                sender={attester?.authenticationKey.publicKey}
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
                receiver={claimer}
                reportError={reportError}
                reportStatus={reportStatus}
                sender={attester}
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
        title="Approve the request"
      />
    </>
  );
};

export default React.memo(Approve);
