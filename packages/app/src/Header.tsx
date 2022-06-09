import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import { Box, IconButton, Link, Stack } from '@mui/material';
import React from 'react';

import { useClaimer } from '@credential/react-components';

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
      <Box component="img" mr={1.5} src={require('@credential/app-config/assets/logo_black.svg')} />
      Credential&nbsp;
      <Box color="black" component="span">
        Platform
      </Box>
    </Link>
  );
};

const Header: React.FC<{ open: boolean; toggleOpen: () => void }> = ({ open, toggleOpen }) => {
  const { account } = useClaimer();

  return (
    <Stack
      alignItems="center"
      bgcolor="white"
      borderBottom="1px solid #F0F0F3"
      direction="row"
      height={70}
      justifyContent="space-between"
      position="fixed"
      px={5}
      width="100%"
      zIndex={9999}
    >
      <Stack alignItems="center" direction="row" spacing={2}>
        <IconButton color="inherit" edge="start" onClick={toggleOpen}>
          {open ? <FormatIndentDecreaseIcon /> : <FormatAlignJustifyIcon />}
        </IconButton>

        <Logo />
      </Stack>
      <Stack direction="row" spacing={2}>
        <Network />
        {account && <AccountInfo account={account} />}
      </Stack>
    </Stack>
  );
};

export default React.memo(Header);
