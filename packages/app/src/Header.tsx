import { DidUri } from '@kiltprotocol/sdk-js';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { alpha, Badge, Box, IconButton, Link, Stack } from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { LogoBlackIcon } from '@credential/app-config/icons';
import { credentialDb } from '@credential/app-db';
import { AppContext } from '@credential/react-components';
import { useToggle } from '@credential/react-hooks';

import { useUnread } from './Notification/useUnread';
import AccountInfo from './AccountInfo';
import Network from './Network';
import Notification from './Notification';

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

const Header: React.FC<{ did?: DidUri; open: boolean; toggleOpen: () => void }> = ({
  did,
  open,
  toggleOpen
}) => {
  const { parse, unParsed } = useContext(AppContext);
  const [notiOpen, toggleNotiOpen] = useToggle();
  const { allUnread } = useUnread(credentialDb);

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
          <IconButton color="inherit" edge="start" onClick={toggleOpen}>
            {open ? <FormatIndentDecreaseIcon /> : <FormatAlignJustifyIcon />}
          </IconButton>
          <Logo />
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <IconButton onClick={handleNotification} sx={{ marginRight: 3 }}>
            <Badge badgeContent={Number(allUnread ?? 0) + unParsed} color="warning" max={99}>
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
          <Network />
          {did && <AccountInfo did={did} />}
        </Stack>
      </Stack>
      <Notification onClose={toggleNotiOpen} open={notiOpen} />
    </>
  );
};

export default React.memo(Header);
