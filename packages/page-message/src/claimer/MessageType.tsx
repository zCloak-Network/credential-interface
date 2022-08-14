import { IMessage, MessageBodyType } from '@kiltprotocol/sdk-js';
import { alpha, Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';

function MessageType({ message }: { message: IMessage }) {
  const { palette } = useTheme();

  const color = useMemo(() => {
    if (
      [MessageBodyType.SUBMIT_ATTESTATION, MessageBodyType.ACCEPT_CREDENTIAL].includes(
        message.body.type
      )
    ) {
      if (
        message.body.type === MessageBodyType.SUBMIT_ATTESTATION &&
        message.body.content.attestation.revoked
      ) {
        return palette.error.main;
      }

      return palette.success.main;
    }

    if (
      [MessageBodyType.REJECT_ATTESTATION, MessageBodyType.REJECT_CREDENTIAL].includes(
        message.body.type
      )
    ) {
      return palette.error.main;
    }

    if ([MessageBodyType.SUBMIT_CREDENTIAL].includes(message.body.type)) {
      return palette.primary.main;
    }

    return palette.warning.main;
  }, [
    message.body,
    palette.error.main,
    palette.primary.main,
    palette.success.main,
    palette.warning.main
  ]);

  const text = useMemo(() => {
    switch (message.body.type) {
      case MessageBodyType.SUBMIT_ATTESTATION:
        return message.body.content.attestation.revoked
          ? 'Revoke Attestation'
          : 'Approved Attestation';

      case MessageBodyType.ACCEPT_CREDENTIAL:
        return 'Accepted Credential';

      case MessageBodyType.REJECT_ATTESTATION:
        return 'Rejected Attestation';

      case MessageBodyType.REJECT_CREDENTIAL:
        return 'Rejected Credential';

      case MessageBodyType.REQUEST_ATTESTATION:
        return 'Request Attestation';

      case MessageBodyType.SUBMIT_CREDENTIAL:
        return 'Submit Credential';

      default:
        return 'Unknown';
    }
  }, [message]);

  return (
    <Box
      sx={() => ({
        width: 150,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: alpha(color, 0.2),
        borderRadius: 1,
        color: color
      })}
    >
      {text}
    </Box>
  );
}

export default React.memo(MessageType);
