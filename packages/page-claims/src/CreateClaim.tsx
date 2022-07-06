import type { Did, ICType } from '@kiltprotocol/sdk-js';

import { CType } from '@kiltprotocol/sdk-js';
import { Box, Stack, SvgIcon, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LogoCircleIcon } from '@credential/app-config/icons';
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader
} from '@credential/react-components';
import { CTypeForm } from '@credential/react-ctype';
import { useToggle } from '@credential/react-hooks';

import SubmitClaim from './SubmitClaim';

const CreateClaim: React.FC = () => {
  const [open, toggleOpen] = useToggle();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [ctype, setCType] = useState<CType>();
  const [attester, setAttester] = useState<Did.FullDidDetails | null>(null);
  const [contents, setContents] = useState<Record<string, unknown>>({});

  const onClose = useCallback(() => {
    toggleOpen();
    navigate('', { state: null });
  }, [navigate, toggleOpen]);

  useEffect(() => {
    if (state) {
      const { cType } = state as { cType?: ICType };

      if (cType) {
        try {
          setCType(CType.fromSchema(cType.schema, cType.owner));
          toggleOpen();
        } catch {}
      }
    }
  }, [state, toggleOpen]);

  if (!ctype) return null;

  return (
    <FullScreenDialog onClose={onClose} open={open}>
      <FullScreenDialogHeader>
        <Stack alignItems="center" direction="row" spacing={3}>
          <SvgIcon component={LogoCircleIcon} sx={{ fontSize: 50 }} viewBox="0 0 60 60" />
          <Box sx={({ palette }) => ({ color: palette.common.white })}>
            <Typography variant="h4">{ctype.schema.title}</Typography>
            <Typography variant="inherit">{ctype.owner}</Typography>
          </Box>
        </Stack>
      </FullScreenDialogHeader>
      <FullScreenDialogContent>
        <Typography mb={4} textAlign="center" variant="h2">
          Create Claim
        </Typography>
        <CTypeForm
          cType={ctype}
          defaultAttester={ctype.owner ?? undefined}
          handleAttester={setAttester}
          onChange={setContents}
        />
        <Box mt={4} textAlign="center">
          <SubmitClaim attester={attester} contents={contents} ctype={ctype} onDone={onClose} />
        </Box>
      </FullScreenDialogContent>
    </FullScreenDialog>
  );
};

export default React.memo(CreateClaim);
