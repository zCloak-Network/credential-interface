import { ISubmitCredential, MessageBody, MessageBodyType } from '@kiltprotocol/types';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { Message } from '@credential/app-db/message';
import { DidsContext } from '@credential/react-dids';
import { useMessages } from '@credential/react-hooks';

import Messages from './Messages';

const AttesterMessage: React.FC = () => {
  const { didUri } = useContext(DidsContext);
  const filter = useCallback(
    (message: Message<MessageBody>) =>
      message.body.type === MessageBodyType.SUBMIT_CREDENTIAL && didUri === message.receiver,
    [didUri]
  );
  const messages = useMessages<ISubmitCredential>(filter);

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
        <Messages messages={messages} />
      </Box>
    </Stack>
  );
};

export default AttesterMessage;
