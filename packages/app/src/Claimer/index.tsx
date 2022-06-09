import { Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useToggle } from '@credential/react-hooks';

import Header from '../Header';
import { ClaimsIcon, CTypeIcon, MessageIcon } from '../icons';
import Sidebar from '../Sidebar';

const Claimer: React.FC = () => {
  const [open, toggleOpen] = useToggle(true);
  const { pathname } = useLocation();
  const { palette, transitions } = useTheme();

  const items = useMemo(
    () => [
      {
        to: '/claimer/ctype',
        active: pathname.startsWith('/claimer/ctype'),
        svgIcon: (
          <CTypeIcon
            color={pathname.startsWith('/claimer/ctype') ? palette.primary.main : undefined}
          />
        ),
        text: 'Credential type'
      },
      {
        to: '/claimer/claims',
        active: pathname.startsWith('/claimer/claims'),
        svgIcon: (
          <ClaimsIcon
            color={pathname.startsWith('/claimer/claims') ? palette.primary.main : undefined}
          />
        ),
        text: 'Claims'
      },
      {
        to: '/claimer/message',
        active: pathname.startsWith('/claimer/message'),
        svgIcon: (
          <MessageIcon
            color={pathname.startsWith('/claimer/message') ? palette.primary.main : undefined}
          />
        ),
        text: 'Message'
      }
    ],
    [palette.primary.main, pathname]
  );

  return (
    <Box bgcolor="#F5F6FA" minHeight="100vh">
      <Header open={open} toggleOpen={toggleOpen} />
      <Sidebar items={items} open={open} />
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

export default Claimer;
