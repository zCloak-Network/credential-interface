import Circle from '@mui/icons-material/Circle';
import { alpha, Button } from '@mui/material';
import React from 'react';

import { Address } from '@credential/react-components';

interface Props {
  account: string;
}

const AccountInfo: React.FC<Props> = ({ account }) => {
  return (
    <Button
      endIcon={<Circle />}
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
      <Address value={account} />
    </Button>
  );
};

export default React.memo(AccountInfo);
