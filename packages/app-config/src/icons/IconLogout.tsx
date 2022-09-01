// generate by buildAssets.js
import { SvgIcon } from '@mui/material';
import React from 'react';

import IconLogoutSvg from '../assets/icon_logout.svg';

function IconLogout(props: any) {
  return (
    <SvgIcon
      component={IconLogoutSvg}
      viewBox="0 0 12.546 12.546"
      {...props}
      sx={{ width: 12.546, height: 12.546, ...props?.sx }}
    />
  );
}

export default React.memo(IconLogout);
