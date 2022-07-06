import { Box, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { DidsContext } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import Header from '../Header';
import { ClaimsIcon, CTypeIcon, MessageIcon } from '../icons';
import Sidebar from '../Sidebar';

const Claimer: React.FC = () => {
  const [open, toggleOpen] = useToggle(true);
  const { pathname } = useLocation();
  const { palette, transitions } = useTheme();
  const { didUri, isReady } = useContext(DidsContext);

  const items = useMemo(
    () => [
      {
        to: '/ctype',
        active: pathname.startsWith('/ctype'),
        svgIcon: (
          <CTypeIcon color={pathname.startsWith('/ctype') ? palette.primary.main : undefined} />
        ),
        text: 'Credential type'
      },
      {
        to: '/claims',
        active: pathname.startsWith('/claims'),
        svgIcon: (
          <ClaimsIcon color={pathname.startsWith('/claims') ? palette.primary.main : undefined} />
        ),
        text: 'Claims'
      },
      {
        to: '/message',
        active: pathname.startsWith('/message'),
        svgIcon: (
          <MessageIcon color={pathname.startsWith('/message') ? palette.primary.main : undefined} />
        ),
        text: 'Message'
      }
    ],
    [palette.primary.main, pathname]
  );

  return (
    <Box bgcolor="#F5F6FA" minHeight="100vh">
      <Header did={didUri} open={open} toggleOpen={toggleOpen} />
      <Sidebar accountType="claimer" items={items} open={open} />
      <Box
        minHeight="100vh"
        pl={open ? '251px' : '120px'}
        pr="32px"
        pt="100px"
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
