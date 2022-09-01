// generate by buildAssets.js
import { SvgIcon } from '@mui/material';
import React from 'react';

import IconCorwnSvg from '../assets/icon_corwn.svg';

function IconCorwn(props: any) {
  return (
    <SvgIcon
      component={IconCorwnSvg}
      viewBox="0 0 14 11.455"
      {...props}
      sx={{ width: 14, height: 11.455, ...props?.sx }}
    />
  );
}

export default React.memo(IconCorwn);
