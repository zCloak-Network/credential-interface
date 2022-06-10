import type { ICTypeMetadata } from '@credential/react-components/CTypeProvider/types';

import { CType } from '@kiltprotocol/sdk-js';
import { Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader
} from '@credential/react-components';
import { CTypeForm } from '@credential/react-ctype';
import { useToggle } from '@credential/react-hooks';

const CreateClaim: React.FC = () => {
  const [open, toggleOpen] = useToggle();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [cType, setCType] = useState<CType>();
  const onClose = useCallback(() => {
    toggleOpen();
    navigate('', { state: null });
  }, [navigate, toggleOpen]);

  useEffect(() => {
    if (state) {
      const { cType } = state as { cType?: ICTypeMetadata };

      if (cType) {
        try {
          setCType(CType.fromSchema(cType.schema, cType.owner));
          toggleOpen();
        } catch {}
      }
    }
  }, [state, toggleOpen]);

  if (!cType) return null;

  return (
    <FullScreenDialog onClose={onClose} open={open}>
      <FullScreenDialogHeader>{cType.hash}</FullScreenDialogHeader>
      <FullScreenDialogContent>
        <Typography mb={4} textAlign="center" variant="h2">
          Create Claim
        </Typography>
        <CTypeForm cType={cType} />
      </FullScreenDialogContent>
    </FullScreenDialog>
  );
};

export default React.memo(CreateClaim);
