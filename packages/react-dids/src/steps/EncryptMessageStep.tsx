import { Did, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { Button, Stack } from '@mui/material';
import { assert } from '@polkadot/util';
import React, { useCallback } from 'react';

import { useKeystore } from '@credential/react-keystore';

import { DidsStepProps } from './types';

interface Props extends DidsStepProps {
  message?: Message | null;
  handleEncrypted: (encrypted: IEncryptedMessage) => void;
  sender?: Did.DidDetails | null;
  receiver?: Did.DidDetails | null;
}

const EncryptMessageStep: React.FC<Props> = ({
  handleEncrypted,
  isFirst,
  message,
  nextStep,
  prevStep,
  receiver,
  reportError,
  sender
}) => {
  const { keyring } = useKeystore();

  const handleNext = useCallback(async () => {
    try {
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
    }
  }, [handleEncrypted, keyring, message, nextStep, receiver, reportError, sender]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <Button onClick={handleNext} variant="contained">
          Encrypt
        </Button>
        {!isFirst && <Button onClick={prevStep}>Back</Button>}
      </Stack>
    </Stack>
  );
};

export default React.memo(EncryptMessageStep);
