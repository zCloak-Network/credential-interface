import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { alpha, Badge, Box, Chip, IconButton, Link, Stack } from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { LogoBlackIcon } from '@credential/app-config/icons';
import { AppContext } from '@credential/react-components';
import { DidsContext } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import DidInfo from '../DidInfo';
import Network from '../Network';
import Notification from '../Notification';
import { useUnread } from '../Notification/useUnread';
import UpgradeFullDid from '../UpgradeFullDid';
import AttesterIcon from './icon_attester.svg';

const Logo: React.FC = () => {
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
};

const Header: React.FC<{
  isAttester?: boolean;
  showUpgrade?: boolean;
}> = ({ isAttester = false, showUpgrade = false }) => {
  const { parse, unParsed } = useContext(AppContext);
  const { didUri, isFullDid } = useContext(DidsContext);
  const [notiOpen, toggleNotiOpen] = useToggle();
  const { allUnread } = useUnread(endpoint.db, didUri);

  const handleNotification = useCallback(() => {
    toggleNotiOpen();
    parse();
  }, [parse, toggleNotiOpen]);

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        height={70}
        justifyContent="space-between"
        position="fixed"
        px={5}
        sx={({ palette }) => ({
          background: palette.common.white,
          borderBottom: '1px solid',
          borderBottomColor: alpha(palette.primary.main, 0.1)
        })}
        width="100%"
        zIndex={999}
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
            <Badge badgeContent={Number(allUnread ?? 0) + unParsed} color="warning" max={99}>
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
          <Network />
          {didUri && <DidInfo did={didUri} />}
          {showUpgrade && !isFullDid && <UpgradeFullDid />}
        </Stack>
      </Stack>
      <Notification onClose={toggleNotiOpen} open={notiOpen} />
    </>
  );
};

export default React.memo(Header);
