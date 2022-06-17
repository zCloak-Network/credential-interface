import type { CType, ICredential } from '@kiltprotocol/sdk-js';

import { alpha, Stack, Typography } from '@mui/material';
import React from 'react';

import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader
} from '@credential/react-components';
import { CTypeForm } from '@credential/react-ctype';

import DownloadButton from '../button/DownloadButton';
import ImportButton from '../button/ImportButton';
import ShareButton from '../button/ShareButton';

interface Props {
  cType: CType;
  credential: ICredential;
  open: boolean;
  onClose?: () => void;
}

const CredentialModal: React.FC<Props> = ({ cType, credential, onClose, open }) => {
  return (
    <FullScreenDialog onClose={onClose} open={open}>
      <FullScreenDialogHeader>{credential.attestation.claimHash}</FullScreenDialogHeader>
      <FullScreenDialogContent>
        <Stack
          alignItems="center"
          spacing={2}
          sx={({ palette }) => ({
            position: 'absolute',
            left: 'calc(100% + 32px)',
            top: 0,

            '.MuiButtonBase-root': {
              width: 44,
              height: 44,
              background: palette.common.white,
              border: '1px solid',
              borderColor: alpha(palette.primary.main, 0.38),
              borderRadius: 2.5
            }
          })}
        >
          <ShareButton credential={credential} withText />
          <ImportButton withText />
          <DownloadButton credential={credential} withText />
        </Stack>
        <Typography mb={5} textAlign="center" variant="h2">
          Credential detail
        </Typography>
        <CTypeForm
          cType={cType}
          defaultAttester={credential.attestation.owner}
          defaultData={credential.request.claim.contents}
          disabled
        />
      </FullScreenDialogContent>
    </FullScreenDialog>
  );
};

export default React.memo(CredentialModal);
