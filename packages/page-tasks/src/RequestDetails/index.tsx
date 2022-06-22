import { Container, Dialog, DialogActions, DialogContent } from '@mui/material';
import React from 'react';

import { RequestForAttestation } from '@credential/app-db/requestForAttestation';
import { DialogHeader } from '@credential/react-components';

import ClaimInfo from './ClaimInfo';
import Details from './Details';

const RequestDetails: React.FC<{
  request: RequestForAttestation;
  open: boolean;
  onClose?: () => void;
}> = ({ onClose, open, request }) => {
  return (
    <Dialog fullScreen open={open}>
      <DialogHeader onClose={onClose}>{request.rootHash}</DialogHeader>
      <Container
        component={DialogContent}
        maxWidth="lg"
        sx={{ background: 'transparent !important' }}
      >
        <ClaimInfo request={request} />
        <Details contents={request.claim.contents} />
      </Container>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default RequestDetails;
