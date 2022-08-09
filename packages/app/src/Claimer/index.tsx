import { Box, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { DidsContext } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import Header from '../Header';
import { ClaimsIcon, CTypeIcon, MessageIcon } from '../icons';
import { useNotification } from '../Notification/useNotification';
import Sidebar from '../Sidebar';

const Claimer: React.FC = () => {
  const [open, toggleOpen] = useToggle(true);
  const { pathname } = useLocation();
  const { palette, transitions } = useTheme();
  const { isReady } = useContext(DidsContext);
  const unreads = useNotification();

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
        text: 'Credentials'
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
      <Header unreads={unreads} />
      <Sidebar accountType="claimer" items={items} open={open} toggleOpen={toggleOpen} />
      <Box
        minHeight="100vh"
        pl={open ? '220px' : '93px'}
        pr={0}
        pt={'70px'}
        sx={{
          position: 'relative',
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
        {!isReady ? (
          <Stack
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              top: '100px',
              left: open ? '274px' : '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress />
            <Typography variant="h6">Connecting to kilt network, please wait 30s.</Typography>
          </Stack>
        ) : (
          <Outlet />
        )}
      </Box>
    </Box>
  );
};

export default Claimer;
