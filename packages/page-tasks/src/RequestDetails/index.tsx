import { Container, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { useContext } from 'react';

import { Attestation } from '@credential/app-db/attestation/Attestation';
import { RequestForAttestation } from '@credential/app-db/requestForAttestation';
import { AppContext, DialogHeader } from '@credential/react-components';
import { useRequestMessages } from '@credential/react-hooks';

import ClaimInfo from './ClaimInfo';
import Details from './Details';

const RequestDetails: React.FC<{
  request: RequestForAttestation;
  attestation?: Attestation;
  open: boolean;
  onClose?: () => void;
  showActions?: boolean;
}> = ({ attestation, onClose, open, request, showActions = true }) => {
  const { db } = useContext(AppContext);
  const messageLinked = useRequestMessages(db, request.rootHash);

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
