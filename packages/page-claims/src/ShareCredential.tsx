import type { ICredential } from '@kiltprotocol/sdk-js';

import { Did, Message } from '@kiltprotocol/sdk-js';
import { Dialog, DialogContent, Stack } from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';

import {
  ButtonUnlock,
  DialogHeader,
  InputDid,
  NotificationContext,
  useClaimer
} from '@credential/react-components';
import { credentialApi } from '@credential/react-hooks/api';

const ShareCredential: React.FC<{
  credential: ICredential;
  open: boolean;
  onClose?: () => void;
}> = ({ credential, onClose, open }) => {
  const [didDetails, setDidDetails] = useState<Did.FullDidDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const { claimer } = useClaimer();
  const { notifyError } = useContext(NotificationContext);

  const shareCredential = useCallback(async () => {
    if (!didDetails) {
      return;
    }

    try {
      setLoading(true);

      if (!didDetails.encryptionKey) {
        throw new Error("Receipt don't has encryptionKey, you can't send to attester.");
      }

      const message = new Message(
        {
          content: [credential],
          type: Message.BodyType.SUBMIT_CREDENTIAL
        },
        claimer.didDetails.did,
        didDetails.did
      );

      await credentialApi.addMessage(
        await claimer.encryptMessage(message, didDetails.assembleKeyId(didDetails.encryptionKey.id))
      );
      onClose?.();
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, [claimer, credential, didDetails, notifyError, onClose]);

  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>Share this with others</DialogHeader>
      <DialogContent>
        <Stack spacing={3}>
          <InputDid onChange={setDidDetails} />
          <ButtonUnlock
            disabled={!didDetails}
            loading={loading}
            onClick={shareCredential}
            variant="contained"
          >
            Share
          </ButtonUnlock>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ShareCredential);
