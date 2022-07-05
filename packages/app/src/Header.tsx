import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { alpha, Badge, Box, IconButton, Link, Stack } from '@mui/material';
import React, { useContext } from 'react';

import { LogoBlackIcon } from '@credential/app-config/icons';
import { AppContext } from '@credential/react-components';

import AccountInfo from './AccountInfo';
import Network from './Network';

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

const Header: React.FC<{ account?: string; open: boolean; toggleOpen: () => void }> = ({
  account,
  open,
  toggleOpen
}) => {
  const { parse, unread } = useContext(AppContext);

  return (
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
        <IconButton onClick={parse} sx={{ marginRight: 3 }}>
          <Badge badgeContent={unread} color="warning" max={99}>
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>
        <Network />
        {account && <AccountInfo account={account} />}
      </Stack>
    </Stack>
  );
};

export default React.memo(Header);
