import { ICredential } from '@kiltprotocol/sdk-js';
import { Box, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';

import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  IdentityIcon
} from '@credential/react-components';
import { DidName } from '@credential/react-dids';
import { RequestStatus } from '@credential/react-hooks/types';

import CredentialContents from './CredentialContents';

interface Props {
  credential: ICredential;
  actions?: React.ReactNode;
  onClose?: () => void;
}

const CredentialModal: React.FC<Props> = ({ credential, onClose }) => {
  const owner = useMemo(() => credential.request.claim.owner, [credential.request.claim.owner]);
  const rootHash = useMemo(() => credential.request.rootHash, [credential.request.rootHash]);
  const ctypeHash = useMemo(
    () => credential.request.claim.cTypeHash,
    [credential.request.claim.cTypeHash]
  );
  const status = useMemo(() => RequestStatus.SUBMIT, []);
  const revoked = useMemo(() => credential.attestation.revoked, [credential.attestation.revoked]);
  const attester = useMemo(() => credential.attestation.owner, [credential.attestation.owner]);
  const contents = useMemo(
    () => credential.request.claim.contents,
    [credential.request.claim.contents]
  );

  return (
    <FullScreenDialog onClose={onClose} open>
      <FullScreenDialogHeader>
        <Stack alignItems="center" direction="row" spacing={3}>
          <IdentityIcon diameter={50} value={owner} />
          <Box sx={({ palette }) => ({ color: palette.common.white })}>
            <Typography variant="h4">
              <DidName value={owner} />
            </Typography>
            <Typography variant="inherit">{rootHash}</Typography>
          </Box>
        </Stack>
      </FullScreenDialogHeader>
      <FullScreenDialogContent>
        <CredentialContents
          attester={attester}
          contents={contents}
          ctypeHash={ctypeHash}
          owner={owner}
          revoked={revoked}
          status={status}
        />
      </FullScreenDialogContent>
    </FullScreenDialog>
  );
};

export default React.memo(CredentialModal);
