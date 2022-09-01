// generate by buildAssets.js
import { SvgIcon } from '@mui/material';
import React from 'react';

import IconImportDidSvg from '../assets/icon_import_did.svg';

function IconImportDid(props: any) {
  return (
    <SvgIcon
      component={IconImportDidSvg}
      viewBox="0 0 16 17"
      {...props}
      sx={{ width: 16, height: 17, ...props?.sx }}
    />
  );
}

export default React.memo(IconImportDid);
