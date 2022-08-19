import type { Did } from '@kiltprotocol/sdk-js';

import { Box, Button, SvgIcon, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LogoCircleIcon } from '@credential/app-config/icons';
import { CType } from '@credential/app-db/ctype';
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader
} from '@credential/react-components';
import { CTypeForm } from '@credential/react-ctype';
import { useToggle } from '@credential/react-hooks';

import SubmitClaim from './SubmitClaim';

function CreateClaim({ ctype }: { ctype: CType }) {
  const [open, toggleOpen] = useToggle();
  const [attester, setAttester] = useState<Did.FullDidDetails | null>(null);
  const [contents, setContents] = useState<Record<string, unknown>>({});
  const navigate = useNavigate();

  const onDone = useCallback(() => {
    toggleOpen();
    navigate('/claimer/claims');
  }, [navigate, toggleOpen]);

  return (
    <>
      <Button onClick={toggleOpen} variant="contained">
        Create Claim
      </Button>
      <FullScreenDialog open={open}>
        <FullScreenDialogHeader
          desc={ctype.hash}
          icon={<SvgIcon component={LogoCircleIcon} sx={{ fontSize: 50 }} viewBox="0 0 60 60" />}
          onClose={toggleOpen}
          title={ctype.schema.title}
        />
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
            <SubmitClaim attester={attester} contents={contents} ctype={ctype} onDone={onDone} />
          </Box>
        </FullScreenDialogContent>
      </FullScreenDialog>
    </>
  );
}

export default React.memo(CreateClaim);
