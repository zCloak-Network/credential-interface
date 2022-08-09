import { Hash } from '@kiltprotocol/sdk-js';
import { Container, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppContext, DialogHeader } from '@credential/react-components';
import { useAttestation, useRequest, useRequestStatus } from '@credential/react-hooks';

import { useMessageLinked } from '../useMessageLinked';
import ClaimInfo from './ClaimInfo';
import Details from './Details';

const RequestDetails: React.FC = () => {
  const { fetcher } = useContext(AppContext);
  const { rootHash } = useParams<{ rootHash: string }>();

  const request = useRequest(rootHash as Hash);
  const attestation = useAttestation(rootHash as Hash);
  const messageLinked = useMessageLinked(rootHash as Hash);
  const status = useRequestStatus(rootHash as Hash);
  const navigate = useNavigate();

  useEffect(() => {
    if (request && fetcher) {
      fetcher.write.messages.read(request.messageId);
    }
  }, [fetcher, request]);

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
          status={status}
        />
        <Details
          contents={request.body.content.requestForAttestation.claim.contents}
          messageLinked={messageLinked}
        />
      </Container>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default RequestDetails;
