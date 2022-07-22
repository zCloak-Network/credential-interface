import { Hash } from '@kiltprotocol/sdk-js';
import { Container, Dialog, DialogActions, DialogContent } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { endpoint } from '@credential/app-config/endpoints';
import { DialogHeader } from '@credential/react-components';
import { useCredential, useRequestMessages } from '@credential/react-hooks';

import ClaimInfo from './ClaimInfo';
import Details from './Details';

const RequestDetails: React.FC = () => {
  const { rootHash } = useParams<{ rootHash: string }>();

  const { attestation, request } = useCredential(endpoint.db, rootHash as Hash);
  const messageLinked = useRequestMessages(endpoint.db, rootHash as Hash);
  const navigate = useNavigate();

  if (!request) {
    return <Dialog fullScreen open></Dialog>;
  }

  return (
    <Dialog fullScreen open>
      <DialogHeader onClose={() => navigate('/attester/tasks', { replace: true })}>
        {rootHash}
      </DialogHeader>
      <Container
        component={DialogContent}
        maxWidth="lg"
        sx={{ background: 'transparent !important' }}
      >
        <ClaimInfo
          attestation={attestation}
          messageLinked={messageLinked}
          request={request}
          showActions
        />
        <Details contents={request.claim.contents} messageLinked={messageLinked} />
      </Container>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default RequestDetails;
