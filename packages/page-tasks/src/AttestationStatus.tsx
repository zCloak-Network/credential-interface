import Circle from '@mui/icons-material/Circle';
import { Stack, SvgIcon } from '@mui/material';
import React, { useEffect, useState } from 'react';

import {
  IMessage,
  IRejectAttestation,
  ISubmitAttestation,
  MessageBodyType
} from '@credential/app-db/message';

type MessageType =
  | (Omit<IMessage, 'body'> & { body: ISubmitAttestation })
  | (Omit<IMessage, 'body'> & { body: IRejectAttestation });

const AttestationStatus: React.FC<{ messageId?: string }> = ({ messageId }) => {
  const [message, setMessage] = useState<MessageType>();

  // useEffect(() => {
  //   if (messageId) {
  //     getAttestationReply(credentialDb, messageId).then(setMessage);
  //   }
  // }, [messageId]);

  return (
    <Stack alignItems="center" direction="row" spacing={1}>
      <SvgIcon
        component={Circle}
        sx={({ palette }) => ({
          width: 8,

          height: 8,
          color: palette.grey[500]
        })}
      />
      {message
        ? message.body.type === MessageBodyType.SUBMIT_ATTESTATION
          ? 'Submited'
          : 'Rejected'
        : 'Invalid'}
    </Stack>
  );
};

export default React.memo(AttestationStatus);
