import { alpha, Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useDids } from '@credential/react-components';

const Network: React.FC = () => {
  const { api, isReady } = useDids();
  const [runtimeChain, setRuntimeChain] = useState<string>();

  useEffect(() => {
    if (isReady) {
      setRuntimeChain(api.runtimeChain.toString());
    }
  }, [api, isReady]);

  return (
    <Button
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
      {isReady ? runtimeChain : 'Connecting to network'}
    </Button>
  );
};

export default React.memo(Network);
