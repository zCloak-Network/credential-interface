import { Box, Paper, Stack, SvgIcon, Typography } from '@mui/material';
import React from 'react';

import { LogoCircleIcon } from '@credential/app-config/icons';
import { ICTypeMetadata } from '@credential/react-components/CTypeProvider/types';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';

import CreateCType from './CreateCType';

const CTypes: React.FC<{ list: ICTypeMetadata[] }> = ({ list }) => {
  return (
    <Box>
      <Box sx={{ textAlign: 'right', mb: 3 }}>
        <CreateCType />
      </Box>
      <Stack spacing={3}>
        {list.map((cType) => (
          <Paper
            key={cType.ctypeHash}
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
            <Stack alignItems="center" direction="row" spacing={2} width="20%">
              <SvgIcon
                component={LogoCircleIcon}
                sx={{ width: 35, height: 35 }}
                viewBox="0 0 60 60"
              />
              <Typography fontWeight={500}>{cType.schema.title}</Typography>
            </Stack>
            <Stack spacing={0.5} width="40%">
              <Typography
                fontWeight={300}
                sx={({ palette }) => ({ color: palette.grey[500] })}
                variant="inherit"
              >
                Attested by
              </Typography>
              <Typography sx={{ ...ellipsisMixin() }} variant="inherit">
                <DidName shorten={false} value={cType.owner} />
              </Typography>
            </Stack>
            <Stack spacing={0.5} width="40%">
              <Typography
                fontWeight={300}
                sx={({ palette }) => ({ color: palette.grey[500] })}
                variant="inherit"
              >
                CType Hash
              </Typography>
              <Typography sx={{ ...ellipsisMixin() }} variant="inherit">
                {cType.ctypeHash}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default CTypes;
