// generate by buildAssets.js
import { SvgIcon } from '@mui/material';
import React from 'react';

import IconStarSvg from '../assets/icon_star.svg';

function IconStar(props: any) {
  return (
    <SvgIcon
      component={IconStarSvg}
      viewBox="0 0 14 13.364"
      {...props}
      sx={{ width: 14, height: 13.364, ...props?.sx }}
    />
  );
}

export default React.memo(IconStar);
