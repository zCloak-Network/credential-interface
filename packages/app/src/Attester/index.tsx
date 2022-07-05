import { Box, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import React, { useContext, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { DidsContext, useDidDetails } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import Header from '../Header';
import { ClaimsIcon, CTypeIcon, MessageIcon } from '../icons';
import Sidebar from '../Sidebar';

const Attester: React.FC = () => {
  const [open, toggleOpen] = useToggle(true);
  const { pathname } = useLocation();
  const { palette, transitions } = useTheme();
  const { didUri, isReady } = useContext(DidsContext);
  const didDetails = useDidDetails(didUri);

  const items = useMemo(
    () => [
      {
        to: '/my-ctype',
        active: pathname.startsWith('/my-ctype'),
        svgIcon: (
          <CTypeIcon color={pathname.startsWith('/my-ctype') ? palette.common.white : undefined} />
        ),
        text: 'My ctypes'
      },
      {
        to: '/tasks',
        active: pathname.startsWith('/tasks'),
        svgIcon: (
          <ClaimsIcon color={pathname.startsWith('/tasks') ? palette.common.white : undefined} />
        ),
        text: 'Tasks'
      },
      {
        to: '/message',
        active: pathname.startsWith('/message'),
        svgIcon: (
          <MessageIcon color={pathname.startsWith('/message') ? palette.common.white : undefined} />
        ),
        text: 'Message'
      }
    ],
    [palette.common.white, pathname]
  );

  return (
    <Box bgcolor="#fff" minHeight="100vh">
      <Header did={didDetails?.uri} open={open} toggleOpen={toggleOpen} />
      <Sidebar accountType="attester" items={items} open={open} />
      <Box
        minHeight="100vh"
        pl={open ? '220px' : '93px'}
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

export default Attester;
