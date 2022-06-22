import { Attestation, Did, Message } from '@kiltprotocol/sdk-js';
import { alpha } from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';

import { RequestForAttestation } from '@credential/app-db/requestForAttestation';
import {
  AppContext,
  ButtonUnlock,
  NotificationContext,
  useAttester
} from '@credential/react-components';
import { useMessage } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

const Approve: React.FC<{
  request: RequestForAttestation;
}> = ({ request }) => {
  const { db } = useContext(AppContext);
  const { attester } = useAttester();
  const parentMessage = useMessage(db, request.messageId);
  const { notifyError } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);

  const approve = useCallback(async () => {
    try {
      setLoading(true);

      if (!attester.isFullDid) {
        throw new Error("You don't has full did details.");
      }

      if (!parentMessage) {
        throw new Error('Can not found parent message.');
      }

      const claimer = Did.LightDidDetails.fromUri(parentMessage.sender);

      if (!claimer.encryptionKey?.id) {
        throw new Error("Claimer has't encryption key");
      }

      const attestation = Attestation.fromRequestAndDid(request, attester.didDetails.uri);

      const message = new Message(
        {
          content: { attestation },
          type: Message.BodyType.SUBMIT_ATTESTATION
        },
        attester.didDetails.uri,
        claimer.uri
      );

      message.inReplyTo = parentMessage.messageId;
      const encrypted = await attester.encryptMessage(message, claimer);

      await attester.attestClaim(request);
      await credentialApi.addMessage({
        receiverKeyId: encrypted.receiverKeyUri,
        senderKeyId: encrypted.senderKeyUri,
        nonce: encrypted.nonce,
        ciphertext: encrypted.ciphertext
      });

      await db.message.add({ ...message, deal: 0 });
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, [attester, db.message, notifyError, parentMessage, request]);

  return (
    <ButtonUnlock
      loading={loading}
      onClick={approve}
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
    </ButtonUnlock>
  );
};

export default React.memo(Approve);
