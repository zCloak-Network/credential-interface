import { IRequestAttestation } from '@kiltprotocol/sdk-js';
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import moment from 'moment';
import React, { useCallback, useContext } from 'react';
import { Link as LinkRouter, useNavigate } from 'react-router-dom';

import { Message } from '@credential/app-db/message';
import { CredentialStatus, CTypeName } from '@credential/react-components';
import { DidName, DidsContext } from '@credential/react-dids';
import { useAttestation, useAttesterRequests, useRequestStatus } from '@credential/react-hooks';
import { RequestStatus } from '@credential/react-hooks/types';

import Approve from './RequestDetails/Approve';
import Reject from './RequestDetails/Reject';
import Revoke from './RequestDetails/Revoke';
import ActionButton from './ActionButton';
import { TaskCard, TaskCardItem } from './TaskCard';
import { useMessageLinked } from './useMessageLinked';

const Row: React.FC<{ request: Message<IRequestAttestation> }> = ({ request }) => {
  const attestation = useAttestation(request.body.content.requestForAttestation.rootHash);
  const status = useRequestStatus(request.body.content.requestForAttestation.rootHash);
  const messageLinked = useMessageLinked(request.body.content.requestForAttestation.rootHash);
  const navigate = useNavigate();

  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  const handleClick = useCallback(() => {
    if (!upMd) navigate(`/attester/tasks/${request.body.content.requestForAttestation.rootHash}`);
  }, [navigate, request.body.content.requestForAttestation.rootHash, upMd]);

  return (
    <TaskCard
      onClick={handleClick}
      operate={
        upMd ? (
          <ActionButton
            attestation={attestation}
            messageLinked={messageLinked}
            request={request}
            status={status}
          />
        ) : (
          <>
            {status === RequestStatus.INIT && (
              <Approve messageLinked={messageLinked} request={request} type="button" />
            )}
            {status === RequestStatus.INIT && (
              <Reject messageLinked={messageLinked} request={request} type="button" />
            )}
            {status === RequestStatus.SUBMIT && attestation && !attestation.revoked && (
              <Revoke
                attestation={attestation}
                messageLinked={messageLinked}
                request={request}
                type="button"
              />
            )}
          </>
        )
      }
    >
      <TaskCardItem
        content={<DidName value={request.body.content.requestForAttestation.claim.owner} />}
        label="Claimer"
      />
      <TaskCardItem
        content={
          <Link
            component={LinkRouter}
            to={`/attester/tasks/${request.body.content.requestForAttestation.rootHash}`}
          >
            {request.body.content.requestForAttestation.rootHash}
          </Link>
        }
        label="Claim hash"
      />
      <TaskCardItem
        content={
          <CTypeName cTypeHash={request.body.content.requestForAttestation.claim.cTypeHash} />
        }
        label="Credential type"
      />
      <TaskCardItem
        content={moment(request.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        label="Approval initiation time"
      />
      <TaskCardItem
        content={
          <CredentialStatus
            revoked={attestation?.revoked}
            role="attester"
            showText
            status={status}
          />
        }
        label="Status"
      />
    </TaskCard>
  );
};

const RequestTable: React.FC = () => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  const { didUri } = useContext(DidsContext);
  const list = useAttesterRequests(didUri);

  if (upMd) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Claimer</TableCell>
              <TableCell>Claim hash</TableCell>
              <TableCell>Credential type</TableCell>
              <TableCell>Approval initiation time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Operate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list?.map((request, index) => (
              <Row key={index} request={request} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Grid columns={{ xs: 8 }} container spacing={3}>
      {list?.map((request) => (
        <Grid key={request.messageId} sm={4} xs={8}>
          <Row request={request} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RequestTable;
