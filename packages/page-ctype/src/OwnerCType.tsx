import { Box, Stack, Tab, Tabs } from '@mui/material';
import React from 'react';

import CTypes from './CTypes';

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
        <Tab label="My CTypes" />
      </Tabs>
      <Box px={4}>
        <CTypes />
      </Box>
    </Stack>
  );
};

export default OwnerCType;
