import type { IAttestation, IEncryptedMessage, IMessage } from '@kiltprotocol/types';

import { Attestation, Did, Message } from '@kiltprotocol/sdk-js';
import { alpha, Button } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { RequestForAttestation } from '@credential/app-db/requestForAttestation';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { EncryptMessageStep, ExtrinsicStep, SendMessageStep } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

const Revoke: React.FC<{
  request: RequestForAttestation;
  attestation: IAttestation;
  messageLinked?: IMessage[];
}> = ({ attestation: _attestation, messageLinked, request }) => {
  const [open, toggleOpen] = useToggle();
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const { keyring } = useKeystore();
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();

  const attestation = useMemo(() => {
    if (didUri) {
      const attestation = Attestation.fromAttestation(_attestation);

      attestation.revoked = true;

      return attestation;
    } else {
      return null;
    }
  }, [_attestation, didUri]);

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
        Revoke
      </Button>
      <DidsModal
        onClose={toggleOpen}
        onDone={toggleOpen}
        open={open}
        steps={(prevStep, nextStep, reportError) => [
          {
            label: 'Sign and submit attestation',
            content: (
              <ExtrinsicStep
                getExtrinsic={getExtrinsic}
                isFirst
                nextStep={nextStep}
                prevStep={prevStep}
                reportError={reportError}
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
              />
            )
          }
        ]}
        title="Approve the request"
      />
    </>
  );
};

export default React.memo(Revoke);
