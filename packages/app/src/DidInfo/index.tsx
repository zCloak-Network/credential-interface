import { Did } from '@kiltprotocol/sdk-js';
import { alpha, Button, useMediaQuery, useTheme } from '@mui/material';
import React, { useRef } from 'react';

import { IdentityIcon } from '@credential/react-components';
import { DidName } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import DidMenu from './DidMenu';

interface Props {
  did: Did.DidDetails;
}

const AccountInfo: React.FC<Props> = ({ did }) => {
  const [open, toggleOpen] = useToggle();
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      <Button
        endIcon={<IdentityIcon value={did.uri} />}
        onClick={toggleOpen}
        ref={anchorEl}
        size={upMd ? 'medium' : 'small'}
        sx={({ palette }) => ({
          border: '1px solid',
          borderColor: alpha(palette.primary.main, 0.12),
          background: palette.common.white,
          borderRadius: 50,
          boxShadow: 'none',
          color: palette.text.primary,
          ':hover': {
            background: palette.common.white
          }
        })}
        variant="contained"
      >
        <DidName value={did.uri} />
      </Button>
      <DidMenu anchorEl={anchorEl.current} did={did} onClose={toggleOpen} open={open} />
    </>
  );
};

export default React.memo(AccountInfo);
