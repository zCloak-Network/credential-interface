import type { IMessage } from '@kiltprotocol/types';

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
import { credentialApi } from '@credential/react-hooks/api';

const Reject: React.FC<{
  request: RequestForAttestation;
  messageLinked?: IMessage[];
}> = ({ messageLinked, request }) => {
  const { db } = useContext(AppContext);
  const { attester } = useAttester();
  const { notifyError } = useContext(NotificationContext);
  const [loading, setLoading] = useState(false);

  const reject = useCallback(async () => {
    try {
      setLoading(true);

      if (!attester.isFullDid) {
        throw new Error("You don't has full did details.");
      }

      const claimer = Did.LightDidDetails.fromUri(request.claim.owner);

      if (!claimer.encryptionKey?.id) {
        throw new Error("Claimer has't encryption key");
      }

      // check attestation validity
      const attestation = await Attestation.query(request.rootHash);

      if (attestation && (await attestation.checkValidity())) {
        throw new Error('Attestation is validity');
      }

      const message = new Message(
        {
          content: request.rootHash,
          type: Message.BodyType.REJECT_ATTESTATION
        },
        attester.didDetails.uri,
        claimer.uri
      );

      message.references = messageLinked?.map((message) => message.messageId);
      const encrypted = await attester.encryptMessage(message, claimer);

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
  }, [attester, db.message, messageLinked, notifyError, request.claim.owner, request.rootHash]);

  return (
    <ButtonUnlock
      loading={loading}
      onClick={reject}
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
      Reject
    </ButtonUnlock>
  );
};

export default React.memo(Reject);
