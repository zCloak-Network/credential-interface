import { MessageBodyType } from '@kiltprotocol/types';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useContext, useMemo } from 'react';

import { AppContext, useAttester } from '@credential/react-components';
import { useMessages } from '@credential/react-hooks';

import Messages from './Messages';

const AttesterMessage: React.FC = () => {
  const { db } = useContext(AppContext);
  const { attester } = useAttester();
  const filter = useMemo(
    () => ({
      receiver: attester.didDetails.uri,
      bodyTypes: [MessageBodyType.REQUEST_ATTESTATION, MessageBodyType.SUBMIT_CREDENTIAL]
    }),
    [attester.didDetails.uri]
  );
  const messages = useMessages(db, filter);

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
