import { Hash } from '@kiltprotocol/sdk-js';
import { Box, Container, Dialog, DialogActions, DialogContent, Stack } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AppContext, DialogHeader } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { useAttestation, useRequest, useRequestStatus } from '@credential/react-hooks';
import { RequestStatus } from '@credential/react-hooks/types';

import { useMessageLinked } from '../useMessageLinked';
import Approve from './Approve';
import ClaimInfo from './ClaimInfo';
import Details from './Details';
import Reject from './Reject';
import Revoke from './Revoke';

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
        <Box sx={{ ...ellipsisMixin(), maxWidth: '80%' }}>{rootHash}</Box>
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
      <DialogActions>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1.5}
          sx={{ display: { md: 'none', xs: 'flex' } }}
        >
          {status === RequestStatus.INIT && (
            <Approve messageLinked={messageLinked} request={request} />
          )}
          {status === RequestStatus.INIT && (
            <Reject messageLinked={messageLinked} request={request} />
          )}
          {status === RequestStatus.SUBMIT && attestation && !attestation.revoked && (
            <Revoke attestation={attestation} messageLinked={messageLinked} request={request} />
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default RequestDetails;
