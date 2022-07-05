import { IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { Button, Stack } from '@mui/material';
import { assert } from '@polkadot/util';
import React, { useCallback } from 'react';

import { credentialDb } from '@credential/app-db';
import { credentialApi } from '@credential/react-hooks/api';

import { DidsStepProps } from './types';

interface Props extends DidsStepProps {
  encryptedMessage?: IEncryptedMessage;
  message?: Message | null;
}

const SendMessage: React.FC<Props> = ({
  encryptedMessage,
  isFirst,
  message,
  nextStep,
  prevStep,
  reportError
}) => {
  const handleNext = useCallback(async () => {
    try {
      assert(encryptedMessage, 'Not encrypted message found');
      assert(message, 'Not message found');

      await credentialDb.message.add({ ...message, deal: 0 });
      await credentialApi.addMessage({
        receiverKeyId: encryptedMessage.receiverKeyUri,
        senderKeyId: encryptedMessage.senderKeyUri,
        nonce: encryptedMessage.nonce,
        ciphertext: encryptedMessage.ciphertext
      });
      nextStep();
    } catch (error) {
      reportError(error as Error);
    }
  }, [encryptedMessage, message, nextStep, reportError]);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <Button onClick={handleNext} variant="contained">
          Send
        </Button>
        {!isFirst && <Button onClick={prevStep}>Back</Button>}
      </Stack>
    </Stack>
  );
};

export default React.memo(SendMessage);
