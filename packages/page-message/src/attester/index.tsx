import { Box, Stack, Tab, Tabs } from '@mui/material';
import React from 'react';

const OwnerCType: React.FC = () => {
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
      <Box px={4}>message</Box>
    </Stack>
  );
};

export default OwnerCType;
