import { MessageBodyType } from '@kiltprotocol/types';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useContext, useMemo } from 'react';

import { credentialDb } from '@credential/app-db';
import { DidsContext } from '@credential/react-dids';
import { useMessages } from '@credential/react-hooks';

import Messages from './Messages';

const AttesterMessage: React.FC = () => {
  const { didUri } = useContext(DidsContext);
  const filter = useMemo(
    () => ({
      receiver: didUri,
      bodyTypes: [MessageBodyType.SUBMIT_CREDENTIAL]
    }),
    [didUri]
  );
  const messages = useMessages(credentialDb, filter);

  return (
    <Stack spacing={3}>
      <Tabs
        sx={{
          px: 2,
          boxShadow: '0px 3px 6px rgba(153, 155, 168, 0.1)'
        }}
        value={0}
      >
        <Tab label="Message" />
      </Tabs>
      <Box px={4}>
        <Messages messages={messages as any} />
      </Box>
    </Stack>
  );
};

export default AttesterMessage;
