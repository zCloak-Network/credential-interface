import { Did, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { Button, Stack } from '@mui/material';
import { assert } from '@polkadot/util';
import React, { useCallback, useEffect, useState } from 'react';

import { useKeystore } from '@credential/react-keystore';

import { DidsStepProps } from './types';

interface Props extends DidsStepProps {
  message?: Message | null;
  handleEncrypted: (encrypted: IEncryptedMessage) => void;
  sender?: Did.DidDetails | null;
  receiver?: Did.DidDetails | null;
}

const EncryptMessageStep: React.FC<Props> = ({
  execFunc,
  handleEncrypted,
  isFirst,
  message,
  nextStep,
  prevStep,
  receiver,
  reportError,
  reportStatus,
  sender,
  step
}) => {
  const { keyring } = useKeystore();
  const [disabled, setDisabled] = useState(false);

  const handleNext = useCallback(async () => {
    try {
      reportStatus(undefined, true);
      setDisabled(true);

      assert(sender, 'No sender did provided');
      assert(sender.encryptionKey, "Sender has't encryptionKey");
      assert(receiver, 'No receiver did provided');
      assert(receiver.encryptionKey, "Receiver has't encryptionKey");
      assert(message, 'Message not provided');

      const encrypted = await message.encrypt(
        sender.encryptionKey.id,
        sender,
        keyring,
        receiver.assembleKeyUri(receiver.encryptionKey.id)
      );

      handleEncrypted(encrypted);
      nextStep();
    } catch (error) {
      reportError(error as Error);
    } finally {
      reportStatus(undefined, false);
      setDisabled(false);
    }
  }, [handleEncrypted, keyring, message, nextStep, receiver, reportError, reportStatus, sender]);

  useEffect(() => {
    execFunc(step, handleNext);
  }, [execFunc, handleNext, step]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <Button disabled={disabled} onClick={handleNext} variant="contained">
          Encrypt
        </Button>
        {!isFirst && <Button onClick={prevStep}>Back</Button>}
      </Stack>
    </Stack>
  );
};

export default React.memo(EncryptMessageStep);
