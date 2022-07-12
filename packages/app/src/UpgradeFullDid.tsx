import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import IconCorwn from './icon_corwn.svg';

const UpgradeFullDid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/attester/did/upgrade')}
      startIcon={<IconCorwn />}
      sx={{
        background: 'linear-gradient(160deg, #6768AC 0%, #343456 100%)',
        borderRadius: '20px',
        color: 'white'
      }}
    >
      Upgrade to FullDID
    </Button>
  );
};

export default React.memo(UpgradeFullDid);
