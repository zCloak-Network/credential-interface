import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Box, Button, Paper, Stack } from '@mui/material';
import React, { useContext, useMemo } from 'react';

import { CTypeContext, useDids } from '@credential/react-components';

import CreateCType from './CreateCType';

const CTypes: React.FC = () => {
  const { cTypeList } = useContext(CTypeContext);
  const { account } = useDids();

  const mineCTypeList = useMemo(
    () => (account ? cTypeList.filter((cType) => cType.owner?.includes(account)) : []),
    [account, cTypeList]
  );

  console.log(mineCTypeList);

  return (
    <Box>
      <Box sx={{ textAlign: 'right', mb: 3 }}>
        <CreateCType />
      </Box>
      <Stack spacing={3}>
        <Paper variant="outlined"></Paper>
      </Stack>
    </Box>
  );
};

export default CTypes;
