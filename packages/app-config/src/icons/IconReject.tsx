// generate by buildAssets.js
import { SvgIcon } from '@mui/material';
import React from 'react';

import IconRejectSvg from '../assets/icon_reject.svg';

function IconReject(props: any) {
  return (
    <SvgIcon
      component={IconRejectSvg}
      viewBox="0 0 12 12"
      {...props}
      sx={{ width: 12, height: 12, ...props?.sx }}
    />
  );
}

export default React.memo(IconReject);
