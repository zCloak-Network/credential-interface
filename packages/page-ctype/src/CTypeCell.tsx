import type { CType } from '@kiltprotocol/sdk-js';

import Circle from '@mui/icons-material/Circle';
import { Box, Button, Paper, Stack, Tooltip, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Ellipsis } from '@credential/react-components';
import { useToggle } from '@credential/react-hooks';

const CTypeCell: React.FC<{ cType: CType }> = ({ cType }) => {
  const [enter, toggleEnter] = useToggle(false);
  const navigate = useNavigate();

  const submitClaim = useCallback(() => {
    navigate('/claimer/claims', {
      state: {
        cType
      }
    });
  }, [cType, navigate]);

  return (
    <Paper
      border="1px solid transparent"
      borderColor={enter ? '#C5C5DE' : 'transparent'}
      component={Stack}
      elevation={enter ? 3 : 1}
      onMouseEnter={toggleEnter}
      onMouseLeave={toggleEnter}
      spacing={1.5}
      sx={{
        padding: 4,
        height: 240,
        borderRadius: 5
      }}
    >
      <Stack alignItems="center" direction="row">
        <Circle
          sx={({ transitions }) => ({
            width: enter ? 60 : 70,
            height: enter ? 60 : 70,
            mr: 1.5,

            transition: transitions.create(['width', 'height'], {
              easing: transitions.easing.sharp,
              duration: transitions.duration.enteringScreen
            })
          })}
        />
        <Typography
          sx={({ transitions }) => ({
            opacity: enter ? 1 : 0,

            transition: transitions.create('opacity', {
              easing: transitions.easing.sharp,
              duration: transitions.duration.enteringScreen
            })
          })}
          variant="h4"
        >
          {cType.schema.title}
        </Typography>
      </Stack>
      <Tooltip title={cType.schema.title}>
        <Ellipsis>
          <Typography
            sx={({ transitions }) => ({
              lineHeight: enter ? 0 : 1,
              opacity: enter ? 0 : 1,

              transition: transitions.create(['line-height'], {
                easing: transitions.easing.sharp,
                duration: transitions.duration.enteringScreen
              })
            })}
            variant="h3"
          >
            {cType.schema.title}
          </Typography>
        </Ellipsis>
      </Tooltip>
      <Box lineHeight={1}>
        <Typography sx={({ palette }) => ({ color: palette.grey[500] })} variant="inherit">
          Attested by
        </Typography>
        <Tooltip placement="top" title={cType.owner ?? ''}>
          <Ellipsis component={Typography} sx={{ fontWeight: 500 }}>
            {cType.owner ?? '--'}
          </Ellipsis>
        </Tooltip>
      </Box>
      <Box
        sx={({ transitions }) => ({
          height: enter ? 40 : 0,
          opacity: enter ? 1 : 0,

          transition: transitions.create(['height', 'opacity'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.enteringScreen
          })
        })}
        textAlign="center"
      >
        <Button onClick={submitClaim} variant="contained">
          Create Claim
        </Button>
      </Box>
    </Paper>
  );
};

export default React.memo(CTypeCell);
