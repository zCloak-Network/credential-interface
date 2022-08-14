import { Box, Grid } from '@mui/material';
import React from 'react';

import { CType } from '@credential/app-db/ctype';

import CTypeCell from './CTypeCell';

const CTypeList: React.FC<{ list: CType[] }> = ({ list }) => {
  return (
    <Box>
      <Grid container spacing={3}>
        {list.map((item, index) => (
          <Grid item key={index} lg={4} md={6} sm={12} xl={3} xs={12}>
            <CTypeCell cType={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default React.memo(CTypeList);
