import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, IconButton, Paper, Stack, SvgIcon, Typography } from '@mui/material';
import React, { useContext, useMemo } from 'react';

import { LogoCircleIcon } from '@credential/app-config/icons';
import { CTypeContext, useDids } from '@credential/react-components';

import CreateCType from './CreateCType';

const CTypes: React.FC = () => {
  const { cTypeList } = useContext(CTypeContext);
  const { account } = useDids();

  const mineCTypeList = useMemo(
    () => (account ? cTypeList.filter((cType) => cType.owner?.includes(account)) : []),
    [account, cTypeList]
  );

  return (
    <Box>
      <Box sx={{ textAlign: 'right', mb: 3 }}>
        <CreateCType />
      </Box>
      <Stack spacing={3}>
        {mineCTypeList.map((cType) => (
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
            <Stack alignItems="center" direction="row" spacing={2}>
              <SvgIcon
                component={LogoCircleIcon}
                sx={{ width: 35, height: 35 }}
                viewBox="0 0 60 60"
              />
              <Typography fontWeight={500}>{cType.schema.title}</Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography
                fontWeight={300}
                sx={({ palette }) => ({ color: palette.grey[500] })}
                variant="inherit"
              >
                Attested by
              </Typography>
              <Typography variant="inherit">{cType.owner}</Typography>
            </Stack>
            <IconButton>
              <MoreHorizIcon />
            </IconButton>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default CTypes;
