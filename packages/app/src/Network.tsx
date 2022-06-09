import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useClaimer } from '@credential/react-components';

const Network: React.FC = () => {
  const { api, isReady } = useClaimer();
  const [runtimeChain, setRuntimeChain] = useState<string>();

  useEffect(() => {
    if (isReady) {
      setRuntimeChain(api.runtimeChain.toString());
    }
  }, [api, isReady]);

  return (
    <Button
      startIcon={!isReady && <CircularProgress size={16} />}
      sx={({ palette }) => ({
        background: '#E0E1EE',
        borderRadius: 50,
        boxShadow: 'none',
        color: palette.primary.main,
        ':hover': {
          background: '#E0E1EE'
        }
      })}
      variant="contained"
    >
      {isReady ? runtimeChain : 'Connecting to network'}
    </Button>
  );
};

export default React.memo(Network);
