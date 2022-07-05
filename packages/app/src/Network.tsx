import { alpha, Button, CircularProgress } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { DidsContext } from '@credential/react-dids';

const Network: React.FC = () => {
  const { blockchain, isReady } = useContext(DidsContext);
  const [runtimeChain, setRuntimeChain] = useState<string>();

  useEffect(() => {
    if (isReady) {
      setRuntimeChain(blockchain.api.runtimeChain.toString());
    }
  }, [blockchain.api.runtimeChain, isReady]);

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
