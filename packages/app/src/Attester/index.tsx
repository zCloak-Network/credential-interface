import { Hash } from '@kiltprotocol/sdk-js';
import { Box, CircularProgress, Stack, SvgIcon, Typography, useTheme } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { credentialDb } from '@credential/app-db';
import RequestDetails from '@credential/page-tasks/RequestDetails';
import { DidsContext } from '@credential/react-dids';
import { useAttestation, useRequest, useToggle } from '@credential/react-hooks';

import Header from '../Header';
import IconMessage from '../icon_message.svg';
import IconCtype from '../icon_myctype.svg';
import IconTask from '../icon_task.svg';
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
  const { transitions } = useTheme();
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
        to: '/attester/my-ctype',
        active: pathname.startsWith('/attester/my-ctype'),
        svgIcon: <SvgIcon component={IconCtype} fontSize="inherit" viewBox="0 0 15.502 15.502" />,
        text: 'My ctypes'
      },
      {
        to: '/attester/tasks',
        active: pathname.startsWith('/attester/tasks'),
        svgIcon: <SvgIcon component={IconTask} fontSize="inherit" viewBox="0 0 16 12.799" />,
        text: 'Tasks',
        extra: taskUnread ? <Badge value={taskUnread} /> : undefined
      },
      {
        to: '/attester/message',
        active: pathname.startsWith('/attester/message'),
        svgIcon: <SvgIcon component={IconMessage} fontSize="inherit" viewBox="0 0 14 14.22" />,
        text: 'Message',
        extra: messageUnread ? <Badge value={messageUnread} /> : undefined
      }
    ],
    [messageUnread, pathname, taskUnread]
  );

  return (
    <>
      <Box bgcolor="#fff" minHeight="100vh">
        <Header
          handleRequest={(rootHash, isRequst) => {
            setRootHash(rootHash);
            setShowActions(isRequst);
            toggleRequestOpen();
          }}
          showUpgrade
        />
        <Sidebar accountType="attester" items={items} open={open} toggleOpen={toggleOpen} />
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
