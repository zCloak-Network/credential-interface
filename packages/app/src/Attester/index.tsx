import { Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useToggle } from '@credential/react-hooks';

import Header from '../Header';
import { ClaimsIcon, CTypeIcon, MessageIcon } from '../icons';
import Sidebar from '../Sidebar';

const Attester: React.FC = () => {
  const [open, toggleOpen] = useToggle(true);
  const { pathname } = useLocation();
  const { palette, transitions } = useTheme();

  const items = useMemo(
    () => [
      {
        to: '/attester/my-ctype',
        active: pathname.startsWith('/attester/my-ctype'),
        svgIcon: (
          <CTypeIcon
            color={pathname.startsWith('/attester/my-ctype') ? palette.common.white : undefined}
          />
        ),
        text: 'My ctypes'
      },
      {
        to: '/attester/tasks',
        active: pathname.startsWith('/attester/tasks'),
        svgIcon: (
          <ClaimsIcon
            color={pathname.startsWith('/attester/tasks') ? palette.common.white : undefined}
          />
        ),
        text: 'Tasks'
      },
      {
        to: '/attester/message',
        active: pathname.startsWith('/attester/message'),
        svgIcon: (
          <MessageIcon
            color={pathname.startsWith('/attester/message') ? palette.common.white : undefined}
          />
        ),
        text: 'Message'
      }
    ],
    [palette.common.white, pathname]
  );

  return (
    <Box bgcolor="#F5F6FA" minHeight="100vh">
      <Header open={open} toggleOpen={toggleOpen} />
      <Sidebar accountType="attester" items={items} open={open} />
      <Box
        minHeight="100vh"
        pl={open ? '274px' : '120px'}
        pr="32px"
        pt="100px"
        sx={{
          boxSizing: 'border-box',

          transition: open
            ? transitions.create('padding', {
                easing: transitions.easing.sharp,
                duration: transitions.duration.enteringScreen
              })
            : transitions.create('padding', {
                easing: transitions.easing.sharp,
                duration: transitions.duration.leavingScreen
              })
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Attester;
