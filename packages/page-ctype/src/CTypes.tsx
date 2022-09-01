import type { ICType } from '@kiltprotocol/sdk-js';

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { IconLogoCircle } from '@credential/app-config/icons';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';

const CTypes: React.FC<{ list: ICType[] }> = ({ list }) => {
  return (
    <Box>
      <Box sx={{ textAlign: 'right', mb: 3 }}>
        <Button
          component={Link}
          startIcon={<AddBoxOutlinedIcon />}
          to="/attester/ctypes/create"
          variant="contained"
        >
          Create ctype
        </Button>
      </Box>
      <Stack spacing={3}>
        {list.map((cType) => (
          <Paper
            key={cType.hash}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingY: 2.5,
              paddingX: 4.5,
              boxShadow: '0px 3px 6px rgba(153, 155, 168, 0.1)'
            }}
            variant="outlined"
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={({ breakpoints }) => ({
                width: '20%',
                [breakpoints.down('lg')]: { width: '40%' },
                [breakpoints.down('md')]: { width: '100%' }
              })}
            >
              <IconLogoCircle sx={{ width: 35, height: 35 }} />
              <Typography fontWeight={500}>{cType.schema.title}</Typography>
            </Stack>
            <Stack
              spacing={0.5}
              sx={({ breakpoints }) => ({
                width: '40%',
                [breakpoints.down('lg')]: { display: 'none' }
              })}
            >
              <Typography
                fontWeight={300}
                sx={({ palette }) => ({ color: palette.grey[500] })}
                variant="inherit"
              >
                Created by
              </Typography>
              <Typography sx={{ ...ellipsisMixin() }} variant="inherit">
                <DidName shorten={false} value={cType.owner} />
              </Typography>
            </Stack>
            <Stack
              spacing={0.5}
              sx={({ breakpoints }) => ({
                width: '40%',
                [breakpoints.down('md')]: { display: 'none' }
              })}
            >
              <Typography
                fontWeight={300}
                sx={({ palette }) => ({ color: palette.grey[500] })}
                variant="inherit"
              >
                CType Hash
              </Typography>
              <Typography sx={{ ...ellipsisMixin() }} variant="inherit">
                {cType.hash}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default CTypes;
