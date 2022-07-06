import type { Attestation, Request } from '@credential/react-hooks/types';

import { Container, Dialog, DialogActions, DialogContent } from '@mui/material';
import React from 'react';

import { credentialDb } from '@credential/app-db';
import { DialogHeader } from '@credential/react-components';
import { useRequestMessages } from '@credential/react-hooks';

import ClaimInfo from './ClaimInfo';
import Details from './Details';

const RequestDetails: React.FC<{
  request: Request;
  attestation?: Attestation;
  open: boolean;
  onClose?: () => void;
  showActions?: boolean;
}> = ({ attestation, onClose, open, request, showActions = true }) => {
  const messageLinked = useRequestMessages(credentialDb, request.rootHash);

  return (
    <Dialog fullScreen open={open}>
      <DialogHeader onClose={onClose}>{request.rootHash}</DialogHeader>
      <Container
        component={DialogContent}
        maxWidth="lg"
        sx={{ background: 'transparent !important' }}
      >
        <ClaimInfo
          attestation={attestation}
          messageLinked={messageLinked}
          request={request}
          showActions={showActions}
        />
        <Details contents={request.claim.contents} messageLinked={messageLinked} />
      </Container>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default RequestDetails;
