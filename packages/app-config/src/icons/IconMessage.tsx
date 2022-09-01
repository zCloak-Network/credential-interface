// generate by buildAssets.js
import { SvgIcon } from '@mui/material';
import React from 'react';

import IconMessageSvg from '../assets/icon_message.svg';

function IconMessage(props: any) {
  return (
    <SvgIcon
      component={IconMessageSvg}
      viewBox="0 0 14 14.22"
      {...props}
      sx={{ width: 14, height: 14.22, ...props?.sx }}
    />
  );
}

export default React.memo(IconMessage);
