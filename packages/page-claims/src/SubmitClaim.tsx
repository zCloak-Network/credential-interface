import type { CType } from '@kiltprotocol/sdk-js';

import { Did, Message } from '@kiltprotocol/sdk-js';
import React, { useCallback, useContext, useState } from 'react';

import {
  ButtonUnlock,
  CredentialContenxt,
  NotificationContext,
  useClaimer
} from '@credential/react-components';
import { credentialApi } from '@credential/react-hooks/api';

const SubmitClaim: React.FC<{
  contents: Record<string, unknown>;
  attester: Did.FullDidDetails | null;
  cType?: CType;
  onDone?: () => void;
}> = ({ attester, cType, contents, onDone }) => {
  const { claimer } = useClaimer();
  const { notifyError } = useContext(NotificationContext);
  const { addCredential } = useContext(CredentialContenxt);
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    if (!cType || !contents || !attester || !claimer.didDetails.encryptionKey) return;

    try {
      setLoading(true);

      const claim = claimer.generateClaim(cType, contents as Record<string, any>);
      const requestForAttestation = await claimer.requestForAttestation(claim);

      const message = new Message(
        {
          content: { requestForAttestation },
          type: Message.BodyType.REQUEST_ATTESTATION
        },
        claimer.didDetails.uri,
        attester.uri
      );

      const encrypted = await claimer.encryptMessage(message, attester);

      await credentialApi.addMessage({
        receiverKeyId: encrypted.receiverKeyUri,
        senderKeyId: encrypted.senderKeyUri,
        nonce: encrypted.nonce,
        ciphertext: encrypted.ciphertext
      });

      const credential = claimer.generateCredential(requestForAttestation, attester.uri);

      addCredential(credential);
      onDone?.();
    } catch (error) {
      notifyError(error);
    } finally {
      setLoading(false);
    }
  }, [addCredential, attester, cType, claimer, contents, notifyError, onDone]);

  return (
    <ButtonUnlock loading={loading} onClick={onSubmit} variant="contained">
      Submit
    </ButtonUnlock>
  );
};

export default React.memo(SubmitClaim);
