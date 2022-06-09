import Circle from '@mui/icons-material/Circle';
import { Button } from '@mui/material';
import React from 'react';

interface Props {
  account: string;
}

const AccountInfo: React.FC<Props> = ({ account }) => {
  return (
    <Button
      endIcon={<Circle />}
      sx={({ palette }) => ({
        border: '1px solid #ECECF2',
        background: '#fff',
        borderRadius: 50,
        boxShadow: 'none',
        color: palette.text.primary,
        ':hover': {
          background: '#fff'
        }
      })}
      variant="contained"
    >
      {account}
    </Button>
  );
};

export default React.memo(AccountInfo);
