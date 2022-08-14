import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  alpha,
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  styled,
  SvgIcon,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { LogoCircleIcon } from '@credential/app-config/icons';
import { BacCardImage, CtypeOfficialImage } from '@credential/app-config/images';
import { CType } from '@credential/app-db/ctype';
import { CTypeContext } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';

const Wrapper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  height: 240,
  borderRadius: theme.spacing(2.5),

  ':hover': {
    boxShadow: theme.shadows[3],

    '.CTypeCell_logo': {
      transform: 'scale(0.8)'
    },

    '.CTypeCell_title': {
      transform: 'translate(60px, -62px) scale(0.8)'
    },
    '.CTypeCell_attester': {
      transform: 'translate(0, -50px)'
    },
    '.CTypeCell_actions': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  },
  '.CTypeCell_logo': {
    width: 60,
    height: 60,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    borderRadius: 30,
    padding: theme.spacing(0.6),
    transformOrigin: 'top left',

    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),

    '>svg': {
      width: '100%',
      height: '100%'
    }
  },
  '.CTypeCell_title': {
    transformOrigin: 'top left',
    ...ellipsisMixin(),

    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  '.CTypeCell_attester': {
    transformOrigin: 'top left',

    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  '.CTypeCell_actions': {
    left: theme.spacing(4),
    right: theme.spacing(4),
    bottom: theme.spacing(4),
    opacity: 0,
    position: 'absolute',
    transform: 'translateY(20px)',
    textAlign: 'center',

    transition: theme.transitions.create(['transform', 'opacity'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}));

const CTypeCell: React.FC<{ cType: CType }> = ({ cType }) => {
  const navigate = useNavigate();
  const { deleteCType } = useContext(CTypeContext);

  const handleDelete = useCallback(() => {
    deleteCType(cType.hash);
  }, [cType.hash, deleteCType]);

  const submitClaim = useCallback(() => {
    navigate('/claimer/claims', {
      state: {
        cType
      }
    });
  }, [cType, navigate]);

  return (
    <Wrapper
      sx={
        cType.type === 'official'
          ? {
              background: `url(${BacCardImage}) no-repeat, #fff`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }
          : {}
      }
    >
      {cType.type !== 'official' && (
        <IconButton
          onClick={handleDelete}
          size="small"
          sx={{ position: 'absolute', right: 10, top: 10 }}
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      )}
      <Stack spacing={1.5}>
        <Box className="CTypeCell_logo">
          {cType.type === 'official' ? (
            <Box component="img" src={CtypeOfficialImage} sx={{ width: 50, height: 50 }} />
          ) : (
            <SvgIcon component={LogoCircleIcon} viewBox="0 0 60 60" />
          )}
        </Box>
        <Tooltip title={cType.schema.title}>
          <Typography className="CTypeCell_title" variant="h3">
            {cType.schema.title}
          </Typography>
        </Tooltip>
        <Stack className="CTypeCell_attester" direction="row" justifyContent="space-between">
          <Box width="50%">
            <Typography sx={({ palette }) => ({ color: palette.grey[600] })} variant="inherit">
              Attested by
            </Typography>
            <Tooltip placement="top" title={cType.owner ?? ''}>
              <Typography sx={{ fontWeight: 500, ...ellipsisMixin() }}>
                <DidName value={cType.owner} />
              </Typography>
            </Tooltip>
          </Box>
          <Box width="50%">
            <Typography sx={({ palette }) => ({ color: palette.grey[600] })} variant="inherit">
              Hash
            </Typography>
            <Tooltip placement="top" title={cType.hash ?? ''}>
              <Typography sx={{ fontWeight: 500, ...ellipsisMixin() }}>{cType.hash}</Typography>
            </Tooltip>
          </Box>
        </Stack>
        <Box className="CTypeCell_actions">
          <Button onClick={submitClaim} variant="contained">
            Create Claim
          </Button>
        </Box>
      </Stack>
    </Wrapper>
  );
};

export default React.memo(CTypeCell);
