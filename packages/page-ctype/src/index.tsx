import { Box, Typography } from '@mui/material';
import React, { useContext } from 'react';

import { CTypeContext } from '@credential/react-components';

import CTypeList from './CTypeList';

const CType: React.FC = () => {
  const { cTypeList } = useContext(CTypeContext);

  return (
    <Box>
      <Typography mb={3} variant="h2">
        Credential type
      </Typography>
      <CTypeList list={cTypeList} />
    </Box>
  );
};

export default CType;
