import { IAttestation } from '@kiltprotocol/sdk-js';
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
import React, { useContext, useMemo } from 'react';
import { Link as LinkRouter } from 'react-router-dom';

import { endpoint } from '@credential/app-config/endpoints';
import { CredentialStatus, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName, DidsContext } from '@credential/react-dids';
import { useCredentials } from '@credential/react-hooks';
import { Request } from '@credential/react-hooks/types';

import ActionButton from './ActionButton';

const Row: React.FC<{ request: Request; attestation?: IAttestation | null }> = ({
  attestation,
  request
}) => {
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ width: 200, ...ellipsisMixin() }}>
          <DidName value={request.claim.owner} />
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ width: 200, ...ellipsisMixin() }}>
          <Link component={LinkRouter} to={`/attester/tasks/${request.rootHash}`}>
            {request.rootHash}
          </Link>
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ width: 200, ...ellipsisMixin() }}>
          <CTypeName cTypeHash={request.claim.cTypeHash} />
        </Box>
      </TableCell>
      <TableCell>{moment(request.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      <TableCell>
        <CredentialStatus
          revoked={attestation?.revoked}
          role="attester"
          showText
          status={request.status}
        />
      </TableCell>
      <TableCell>
        <ActionButton attestation={attestation} request={request} />
      </TableCell>
    </TableRow>
  );
};

const RequestTable: React.FC = () => {
  const { didUri } = useContext(DidsContext);
  const filter = useMemo(() => ({ receiver: didUri }), [didUri]);
  const list = useCredentials(endpoint.db, filter);

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
          {list?.map(({ attestation, request }, index) => (
            <Row attestation={attestation} key={index} request={request} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestTable;
