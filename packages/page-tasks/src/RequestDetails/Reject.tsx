import type { IEncryptedMessage, IMessage } from '@kiltprotocol/types';

import type { Request } from '@credential/react-hooks/types';

import { Message } from '@kiltprotocol/sdk-js';
import { alpha, Button } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { credentialDb } from '@credential/app-db';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { encryptMessage, sendMessage } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

const Reject: React.FC<{
  request: Request;
  messageLinked?: IMessage[];
}> = ({ messageLinked, request }) => {
  const { keyring } = useKeystore();
  const [open, toggleOpen] = useToggle();
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();

  const message = useMemo(() => {
    if (!didUri) {
      return null;
    }

    const message = new Message(
      {
        content: request.rootHash,
        type: Message.BodyType.REJECT_ATTESTATION
      },
      didUri,
      request.claim.owner
    );

    message.references = messageLinked?.map((message) => message.messageId);

    return message;
  }, [didUri, messageLinked, request.claim.owner, request.rootHash]);
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
      </Button>
      <DidsModal
        onClose={toggleOpen}
        onDone={onDone}
        open={open}
        steps={[
          {
            label: 'Encrypt message',
            exec: () =>
              encryptMessage(keyring, message, attester, claimer).then(setEncryptedMessage)
          },
          {
            label: 'Send message',
            exec: () => sendMessage(encryptedMessage)
          }
        ]}
        title="Reject the request"
      />
    </>
  );
};

export default React.memo(Reject);
