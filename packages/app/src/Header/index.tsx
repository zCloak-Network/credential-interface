import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { alpha, Badge, Box, Chip, IconButton, Link, Stack } from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { LogoBlackIcon } from '@credential/app-config/icons';
import { AppContext } from '@credential/react-components';
import { DidsContext } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import DidInfo from '../DidInfo';
import Network from '../Network';
import Notification from '../Notification';
import { UseNotification } from '../Notification/useNotification';
import UpgradeFullDid from '../UpgradeFullDid';
import AttesterIcon from './icon_attester.svg';

function Logo() {
  return (
    <Link
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '20px',
        fontWeight: 700,
        cursor: 'pointer'
      }}
    >
      <Box component={LogoBlackIcon} mr={1.5} />
      Credential&nbsp;
      <Box color="black" component="span">
        Platform
      </Box>
    </Link>
  );
}

function Header({
  isAttester = false,
  showUpgrade = false,
  unreads
}: {
  isAttester?: boolean;
  showUpgrade?: boolean;
  unreads: UseNotification;
}) {
  const { parse, unParsed } = useContext(AppContext);
  const { didUri, isFullDid } = useContext(DidsContext);
  const [notiOpen, toggleNotiOpen] = useToggle();

  const handleNotification = useCallback(() => {
    toggleNotiOpen();
    parse();
  }, [parse, toggleNotiOpen]);

  return (
    <>
      <Box
        fontSize="small"
        sx={({ palette }) => ({
          zIndex: 999,
          position: 'fixed',
          top: 0,
          width: '100%',
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: palette.warning.main,
          color: palette.common.white
        })}
      >
        <ReportProblemOutlinedIcon fontSize="small" sx={{ marginRight: 2 }} />
        Please backup your DID account and your credential file before logging out and do not clear
        local storage for the duration of this event.
      </Box>
      <Stack
        alignItems="center"
        direction="row"
        height={70}
        justifyContent="space-between"
        px={5}
        sx={({ palette }) => ({
          zIndex: 999,
          position: 'fixed',
          top: 30,
          width: '100%',
          background: palette.common.white,
          borderBottom: '1px solid',
          borderBottomColor: alpha(palette.primary.main, 0.1)
        })}
      >
        <Stack alignItems="center" direction="row" spacing={2}>
          <Logo />
          {isAttester && (
            <Chip
              color="primary"
              label={
                <Stack alignItems="center" direction="row" spacing={0.5}>
                  <AttesterIcon />
                  <Box>Attester</Box>
                </Stack>
              }
              variant="outlined"
            />
          )}
          <Chip color="warning" label="Beta" variant="outlined" />
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <IconButton onClick={handleNotification} sx={{ marginRight: 3 }}>
            <Badge badgeContent={unreads.allUnread + unParsed} color="warning" max={99}>
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
          <Network />
          {didUri && <DidInfo did={didUri} />}
          {showUpgrade && !isFullDid && <UpgradeFullDid />}
        </Stack>
      </Stack>
      <Notification onClose={toggleNotiOpen} open={notiOpen} unreads={unreads} />
    </>
  );
}

export default React.memo(Header);
