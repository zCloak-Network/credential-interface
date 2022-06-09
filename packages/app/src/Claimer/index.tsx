import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../Header';

const Claimer: React.FC = () => {
  return (
    <Box bgcolor="#F5F6FA" minHeight="100vh">
      <Header />
      <Outlet />
    </Box>
  );
};

export default Claimer;
