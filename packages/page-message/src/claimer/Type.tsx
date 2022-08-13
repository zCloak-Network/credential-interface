import { MessageBodyType } from '@kiltprotocol/sdk-js';
import { alpha, Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';

function Type({ type }: { type: MessageBodyType }) {
  const { palette } = useTheme();

  const color = useMemo(() => {
    if (type === MessageBodyType.SUBMIT_ATTESTATION || type === MessageBodyType.ACCEPT_CREDENTIAL) {
      return palette.success.main;
    }

    if (type === MessageBodyType.REJECT_ATTESTATION || type === MessageBodyType.REJECT_CREDENTIAL) {
      return palette.error.main;
    }

    return palette.warning.main;
  }, [palette.error.main, palette.success.main, palette.warning.main, type]);

  const text = useMemo(() => {
    switch (type) {
      case MessageBodyType.SUBMIT_ATTESTATION:
        return 'Submit Attestation';

      case MessageBodyType.ACCEPT_CREDENTIAL:
        return 'Accept Credential';

      case MessageBodyType.REJECT_ATTESTATION:
        return 'Reject Attestation';

      case MessageBodyType.REJECT_CREDENTIAL:
        return 'Reject Credential';

      case MessageBodyType.REQUEST_ATTESTATION:
        return 'Request Attestation';

      case MessageBodyType.SUBMIT_CREDENTIAL:
        return 'Submit Credential';

      default:
        return 'Unknown';
    }
  }, [type]);

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

export default React.memo(Type);
