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
  const [fullDid, setFullDid] = useState<Did.FullDidDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const { claimer } = useClaimer();
  const { notifyError } = useContext(NotificationContext);

  const shareCredential = useCallback(async () => {
    if (!fullDid) {
      return;
    }

    try {
      setLoading(true);

      const message = new Message(
        {
          content: [credential],
          type: Message.BodyType.SUBMIT_CREDENTIAL
        },
        claimer.didDetails.uri,
        fullDid.uri
      );

      const encrypted = await claimer.encryptMessage(message, fullDid);

      await credentialApi.addMessage({
        receiverKeyId: encrypted.receiverKeyUri,
        senderKeyId: encrypted.senderKeyUri,
        nonce: encrypted.nonce,
        ciphertext: encrypted.ciphertext
      });
      onClose?.();
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, [claimer, credential, fullDid, notifyError, onClose]);

  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>Share this with others</DialogHeader>
      <DialogContent>
        <Stack spacing={3}>
          <InputDid onChange={setFullDid} />
          <ButtonUnlock
            disabled={!fullDid}
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
