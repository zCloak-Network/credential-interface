import { MessageBody } from '@kiltprotocol/sdk-js';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

import { Message } from '@credential/app-db/message';
import { useDerivedDid } from '@credential/react-dids';
import { useMessages } from '@credential/react-hooks';

import MessagesTable from './claimer/Messages';

function Messages() {
  const did = useDerivedDid();
  const [type, setType] = useState(0);

  const filter = useCallback(
    (message: Message<MessageBody>) => {
      if (type === 1) return message.receiver === did?.uri;

      if (type === 2) return message.sender === did?.uri;

      return true;
    },
    [did, type]
  );

  const messages = useMessages(filter);

  return (
    <>
      <Stack spacing={4}>
        <Typography variant="h2">Messages</Typography>
        <Tabs onChange={(_, value) => setType(value)} value={type}>
          <Tab label="All" />
          <Tab label="Received" />
          <Tab label="Sent" />
        </Tabs>
        <Box>
          <MessagesTable messages={messages} />
        </Box>
      </Stack>
    </>
  );
}

export default Messages;
