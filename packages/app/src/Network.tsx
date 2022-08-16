import Circle from '@mui/icons-material/Circle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  alpha,
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';

import { endpoints, storeEndpoint } from '@credential/app-config/endpoints';
import { DidsContext } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

const Network: React.FC = () => {
  const { blockchain, isReady } = useContext(DidsContext);
  const [runtimeChain, setRuntimeChain] = useState<string>();
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const [open, toggleOpen] = useToggle();
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (isReady) {
      setRuntimeChain(blockchain.api.runtimeChain.toString());
    }
  }, [blockchain, isReady]);

  return (
    <>
      <Button
        endIcon={<KeyboardArrowDownIcon />}
        onClick={toggleOpen}
        ref={anchorEl}
        size={upMd ? 'medium' : 'small'}
        startIcon={!isReady && <CircularProgress size={20} />}
        sx={({ palette }) => ({
          background: alpha(palette.primary.main, 0.2),
          borderRadius: 50,
          boxShadow: 'none',
          color: palette.primary.main,
          ':hover': {
            background: alpha(palette.primary.main, 0.2)
          }
        })}
        variant="contained"
      >
        {isReady ? runtimeChain : upMd ? 'Connecting to network' : 'Connecting'}
      </Button>
      <Menu anchorEl={anchorEl.current} onClose={toggleOpen} open={open}>
        <Typography marginBottom={1.5}>Select a network</Typography>
        {Object.keys(endpoints).map((_endpoint) => (
          <MenuItem
            key={_endpoint}
            onClick={() => {
              storeEndpoint(_endpoint);
              window.location.reload();
            }}
            sx={({ palette }) => ({
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 48,
              paddingX: 3,
              paddingY: 1.5,
              border: '1px solid',
              borderColor: runtimeChain === _endpoint ? palette.primary.main : 'transparent',
              borderRadius: 2.5,
              background:
                runtimeChain === _endpoint ? alpha(palette.primary.main, 0.2) : 'transparent',
              color: palette.primary.main
            })}
          >
            {_endpoint}
            <Circle
              sx={({ palette }) => ({
                width: 10,
                height: 10,
                marginLeft: 3,
                color: runtimeChain === _endpoint ? palette.primary.main : 'transparent'
              })}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default React.memo(Network);
