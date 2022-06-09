import { Box, Link, Stack } from '@mui/material';
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

const Header: React.FC = () => {
  const { account, api, claimer, isReady } = useClaimer();

  console.log(claimer, isReady, api);

  return (
    <Stack
      alignItems="center"
      bgcolor="white"
      direction="row"
      height={70}
      justifyContent="space-between"
      px={5}
    >
      <Logo />
      <Stack direction="row" spacing={2}>
        <Network />
        {account && <AccountInfo account={account} />}
      </Stack>
    </Stack>
  );
};

export default React.memo(Header);
