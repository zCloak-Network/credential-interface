import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';

import ReceivedMessages from './claimer/ReceivedMessages';
import SentMessages from './claimer/SentMessages';

const Messages: React.FC = () => {
  const [type, setType] = useState(0);

  return (
    <>
      <Stack spacing={4}>
        <Typography variant="h2">Messages</Typography>
        <Tabs onChange={(_, value) => setType(value)} value={type}>
          <Tab label="Received" />
          <Tab label="Sent" />
        </Tabs>
        <Box>
          {type === 0 && <ReceivedMessages />}
          {type === 1 && <SentMessages />}
        </Box>
      </Stack>
    </>
  );
};

export default Messages;
