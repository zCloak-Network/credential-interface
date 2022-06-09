import { Button } from '@mui/material';
import React from 'react';

const Network: React.FC = () => {
  return (
    <Button
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
      KILT Peregrine
    </Button>
  );
};

export default React.memo(Network);
