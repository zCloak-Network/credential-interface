import { Hash } from '@kiltprotocol/sdk-js';
import { Box, CircularProgress, Stack, Typography, useTheme } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { credentialDb } from '@credential/app-db';
import RequestDetails from '@credential/page-tasks/RequestDetails';
import { DidsContext } from '@credential/react-dids';
import { useAttestation, useRequest, useToggle } from '@credential/react-hooks';

import Header from '../Header';
import { ClaimsIcon, CTypeIcon, MessageIcon } from '../icons';
import { useUnread } from '../Notification/useUnread';
import Sidebar from '../Sidebar';

const Badge: React.FC<{ value: number }> = ({ value }) => {
  return (
    <Box
      color="warning"
      sx={({ palette }) => ({
        minWidth: 20,
        height: 20,
        borderRadius: '10px',
        textAlign: 'center',
        lineHeight: '20px',
        background: palette.warning.main,
        fontSize: 12,
        color: palette.common.black
      })}
    >
      {value > 99 ? '99+' : value}
    </Box>
  );
};

const Attester: React.FC = () => {
  const [open, toggleOpen] = useToggle(true);
  const { pathname } = useLocation();
  const { palette, transitions } = useTheme();
  const { didUri, isReady } = useContext(DidsContext);
  const { messageUnread, taskUnread } = useUnread(credentialDb, didUri);
  const [requestOpen, toggleRequestOpen] = useToggle();
  const [rootHash, setRootHash] = useState<Hash>();
  const [showActions, setShowActions] = useState(false);
  const request = useRequest(credentialDb, rootHash);
  const attestation = useAttestation(rootHash);

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
        text: 'Tasks',
        extra: taskUnread ? <Badge value={taskUnread} /> : undefined
      },
      {
        to: '/message',
        active: pathname.startsWith('/message'),
        svgIcon: (
          <MessageIcon color={pathname.startsWith('/message') ? palette.common.white : undefined} />
        ),
        text: 'Message',
        extra: messageUnread ? <Badge value={messageUnread} /> : undefined
      }
    ],
    [messageUnread, palette.common.white, pathname, taskUnread]
  );

  return (
    <>
      <Box bgcolor="#fff" minHeight="100vh">
        <Header
          did={didUri}
          handleRequest={(rootHash, isRequst) => {
            setRootHash(rootHash);
            setShowActions(isRequst);
            toggleRequestOpen();
          }}
          open={open}
          toggleOpen={toggleOpen}
        />
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
      {requestOpen && request && (
        <RequestDetails
          attestation={attestation}
          onClose={toggleRequestOpen}
          open={requestOpen}
          request={request}
          showActions={showActions}
        />
      )}
    </>
  );
};

export default Attester;
