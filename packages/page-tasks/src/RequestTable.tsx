import { IRequestAttestation } from '@kiltprotocol/sdk-js';
import {
  Box,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import moment from 'moment';
import React, { useContext } from 'react';
import { Link as LinkRouter } from 'react-router-dom';

import { Message } from '@credential/app-db/message';
import { CredentialStatus, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName, DidsContext } from '@credential/react-dids';
import { useAttestation, useAttesterRequests, useRequestStatus } from '@credential/react-hooks';

import ActionButton from './ActionButton';

const Row: React.FC<{ request: Message<IRequestAttestation> }> = ({ request }) => {
  const attestation = useAttestation(request.body.content.requestForAttestation.rootHash);
  const status = useRequestStatus(request.body.content.requestForAttestation.rootHash);

  return (
    <TableRow>
      <TableCell>
        <Box sx={{ width: 200, ...ellipsisMixin() }}>
          <DidName value={request.body.content.requestForAttestation.claim.owner} />
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ width: 200, ...ellipsisMixin() }}>
          <Link
            component={LinkRouter}
            to={`/attester/tasks/${request.body.content.requestForAttestation.rootHash}`}
          >
            {request.body.content.requestForAttestation.rootHash}
          </Link>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ width: 200, ...ellipsisMixin() }}>
          <CTypeName cTypeHash={request.body.content.requestForAttestation.claim.cTypeHash} />
        </Box>
      </TableCell>
      <TableCell>{moment(request.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      <TableCell>
        <CredentialStatus revoked={attestation?.revoked} role="attester" showText status={status} />
      </TableCell>
      <TableCell>
        <ActionButton attestation={attestation} request={request} status={status} />
      </TableCell>
    </TableRow>
  );
};

const RequestTable: React.FC = () => {
  const { didUri } = useContext(DidsContext);
  const list = useAttesterRequests(didUri);

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
};

export default RequestTable;
